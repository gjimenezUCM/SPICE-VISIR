/**
 * @fileoverview This class manages all GET petitions to obtain the perspective files with the networks data.
 * @package Requires Axios package to be able to send the GET petitions.  
 * @package Requires React package to execute Dispatch functions. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EFileSource, initialOptions } from '../constants/viewOptions';
import { validateConfigurationSeed, validatePerspectiveDataJSON, validatePerspectiveIDfile as validateAllPerspectiveIDfile } from '../constants/ValidateFiles';
import { IPerspectiveData, PerspectiveId as IPerspectiveId, PerspectiveId } from '../constants/perspectivesTypes';
import config from '../appConfig.json';
//Packages
import { Axios } from 'axios'
//Local File
import { ILoadingState } from '../basicComponents/LoadingFrontPanel';
import { ITranslation } from './CTranslation';

const apiVersion = "v2.0";

export default class RequestManager {
    isActive: boolean;
    axios: Axios;
    usingAPI: boolean;


    jobTimeOut: number = 2; //in seconds. Visir wait this time between asking CM for the state of a job
    jobMaxWaitTime: number = 30; //in seconds. Max wait time of VISIR while asking for a job if its finished

    currentJobWaitTime: number = 0;

    //URL to ask for files when local url is selected
    baseLocalURL: string = "./data/";

    //GET REQUEST
    allPerspectivesGETurl: string = `${apiVersion}/visir/files`;
    singlePerspectiveGETurl: string = `${apiVersion}/visir/files/`;
    perspectiveConfigGETurl: string = `${apiVersion}/perspectives/`;
    confSeedGETurl: string = `${apiVersion}/visir/seed`;
    //POST REQUEST
    confSeedPOSTurl: string = `${apiVersion}/perspectives`;
    //DELETE REQUEST
    deletePerspectiveDELurl: string = `${apiVersion}/perspectives`;

    //Change the state of the loading spinner
    setLoadingState: React.Dispatch<React.SetStateAction<ILoadingState>>;
    translation: ITranslation | undefined;

    apiDefaultURL: string;
    apiUsername: string;
    apiPassword: string;

    /**
     * Constructor of the class
     */
    constructor(setLoadingState: React.Dispatch<React.SetStateAction<ILoadingState>>, translation: ITranslation | undefined,
        apiURL: string, apiUsername: string, apiPassword: string) {
        this.setLoadingState = setLoadingState;
        this.translation = translation;

        this.apiDefaultURL = apiURL;
        this.apiUsername = apiUsername;
        this.apiPassword = apiPassword;

        this.isActive = initialOptions.fileSource === EFileSource.Api;
        this.usingAPI = false;

        this.axios = new Axios();
    }

    /**
     * Initialize axios API
     * @param {String} baseURL base url of all axios petitions
     */
    init(baseURL: string | undefined, apiUser?: string, apiPass?: string) {
        if (baseURL !== undefined) {
            if (baseURL[baseURL.length - 1] !== '/') {
                baseURL = `${baseURL}/`
            }

            console.log(`Source url changed to ${baseURL}`)

            this.apiUsername = apiUser ? apiUser : "";
            this.apiPassword = apiPass ? apiPass : "";

            this.axios = new Axios({
                baseURL: baseURL,
                timeout: config.MAX_GET_REQUEST_TIMEOUT,
                auth: {
                    username: this.apiUsername,
                    password: this.apiPassword
                }

            });
            this.isActive = true;
        } else
            throw new Error("the new base url is undefined");

    }

    /**
     * Send a request for the data file of a perspective whose id is perspective ID and whose name is name.
     * When the request is finished, executes a callback function whose parameter will be the perspective Data, undefined
     * if something went wrong.
     */
    requestPerspectiveFIle(perspectiveId: string, name: string, callback: Function) {
        this.setLoadingState({
            isActive: true, msg: `${this.translation?.loadingText.requestPerspective ? this.translation?.loadingText.requestPerspective : "Requesting perspective "} ${name}`
        });

        this.getPerspective(perspectiveId)
            .then((response: any) => {
                if (response.status === 200) {

                    let perspective: IPerspectiveData;
                    if (typeof response.data === "object") {
                        perspective = validatePerspectiveDataJSON(response.data);
                    } else {
                        perspective = validatePerspectiveDataJSON(JSON.parse(response.data));
                    }

                    perspective.id = perspectiveId;
                    perspective.name = perspective.name === undefined ? name : perspective.name;

                    callback(perspective);
                } else {
                    throw new Error(`Error while getting Perspective ${perspectiveId}: ${response.statusText}`);
                }
            })
            .catch((error: any) => {
                callback(undefined);

                console.log(`Perspective file with id: (${perspectiveId}) was not found: ${error}`);
                console.log(error);
                alert(`Perspective file with id: (${perspectiveId}) was not found: ${error.message}`);

            }).finally(() => {
                this.setLoadingState({ isActive: false });
            });
    }
    /**
    * Send a GET petition to obtain a singleFile in a directory
    * @param id Id of the file we want to get.
    * @returns {Object} Returns the file
    */
    getPerspective(id: string) {
        return this.requestToUrl(this.usingAPI ? `${this.singlePerspectiveGETurl}${id}` : `${id}.json`);
    }


    /**
     * Send a request for the id and names of all available perspectives.
     * When the request is finished, executes a callback function with all the new ids as parameter, undefined if
     * something went wrong.
     */
    requestAllPerspectivesIds(callback: Function, stateCallback?: Function) {
        this.setLoadingState({
            isActive: true, msg: `${this.translation?.loadingText.requestingAllPerspectives ?
                this.translation?.loadingText.requestingAllPerspectives
                : "Requesting All perspectives"}`
        });

        this.getAllPerspectives()
            .then((response: any) => {
                if (response.status === 200) {
                    let allIds: IPerspectiveId[] = [];
                    if (typeof response.data === "object") {
                        allIds = validateAllPerspectiveIDfile(response.data);
                    } else {
                        allIds = validateAllPerspectiveIDfile(JSON.parse(response.data));
                    }

                    callback(allIds);
                    if (stateCallback) stateCallback();
                } else {
                    throw new Error(`Error while getting All perspective files ${response.statusText}`);
                }
            })
            .catch((error: any) => {
                callback(undefined);
                if (stateCallback) stateCallback();

                console.log(`All IDs file was not found:`);
                console.log(error);
                alert(`All IDs file was not found: ${error.message}`);
            })
            .finally(() => {
                this.setLoadingState({ isActive: false });
            });
    }
    /**
     * Get all perspectives information 
     * @returns {Object} returns the information of all perspectives
     */
    getAllPerspectives() {
        return this.requestToUrl(this.usingAPI ? `${this.allPerspectivesGETurl}` : "dataList.json");
    }

    /**
     * Request the configuration tool seed from the CM and validate
     * @param callback 
     */
    requestConfigurationToolSeed(callback: Function, setIsActive: Function) {
        this.setLoadingState({ isActive: true, msg: `${this.translation?.loadingText.requestingConfToolSeed}` });

        this.getConfigurationToolSeed()
            .then((response: any) => {

                if (response.status === 200) {
                    let data = typeof response.data === "object" ? response.data : JSON.parse(response.data);

                    data = validateConfigurationSeed(data);

                    callback(data);

                } else {
                    throw new Error(`Error while getting Configuration tool Seed. ${response.statusText}`);
                }
            })
            .catch((error: any) => {
                callback(undefined);
                setIsActive(false);

                console.log(`Configuration tool seed was not found:`);
                console.log(error);

                alert(`Configuration tool seed was not found: ${error.message}`);
            }).finally(() => {
                this.setLoadingState({ isActive: false });
            });
    }

    /**
     * Get configuration tool seed
     * @returns 
     */
    getConfigurationToolSeed() {
        return this.requestToUrl(this.usingAPI ? this.confSeedGETurl : "configurationTool/seedFile.json");
    }


    /**
     * Request something to an url
     * @param url 
     * @returns 
     */
    requestToUrl(url: string): any {
        console.log(`${this.translation?.loadingText.simpleRequest} ${this.axios.defaults.baseURL}${url}`);
        this.currentJobWaitTime = 0;

        return this.axios.get(url)
            .then(async (response) => {
                console.log(response)

                const data = JSON.parse(response.data);

                if (response.status === 202) {

                    await delay(this.jobTimeOut);
                    return this.askJobInProgress(data.path);

                } else if (response.status === 200) {
                    return { status: response.status, data: data };;
                } else {
                    throw new Error(`Error while requestion a file to ${this.axios.defaults.baseURL}${url}: ${response.statusText}`);
                }

            })
            .catch((error) => {
                throw error;
            });
    }

    /**
     * Ask if a job is in progress and return the result if when the job is completed
     * @param url 
     * @returns 
     */
    askJobInProgress(url: any): any {
        this.currentJobWaitTime += this.jobTimeOut;

        if (this.currentJobWaitTime > this.jobMaxWaitTime) {
            throw new Error("Max wait time for the community model reached");
        }
        this.setLoadingState({ isActive: true, msg: `${this.translation?.loadingText.CMisBusy} (${this.currentJobWaitTime / 2})` });

        return this.axios.get(url)
            .then(async (response) => {
                console.log(`Job in ${this.axios.defaults.baseURL}${url}`);
                console.log(response)

                const data = JSON.parse(response.data);

                if (response.status === 200 || response.status === 202) {

                    switch (data.job["job-state"]) {

                        case "ERROR":
                            console.log(`Job with an error, ${data.job.data}`)
                            throw new Error(`Community Model had an error: ${data.job.data}`)

                        case "COMPLETED":
                            return { status: response.status, data: data.job.data };

                        case "STARTED":
                        default:
                            await delay(this.jobTimeOut);
                            return this.askJobInProgress(data.job.path);


                    }
                } else {
                    throw new Error(`Error while waiting for a job in path ${url}: ${response.statusText}`);
                }
            })
            .catch((error) => {
                throw error;
            })
    }

    /**
     * Update the baseURL of the requestManager
     * @param {EFileSource} newSource the new fileSource
     */
    changeBaseURL(newSource: EFileSource, apiURL?: string, apiUser?: string, apiPass?: string) {
        let newUrl = newSource === EFileSource.Local ? this.baseLocalURL : apiURL;

        if (apiURL === undefined && newSource === EFileSource.Api) {
            newUrl = this.apiDefaultURL;
        }

        this.usingAPI = newSource === EFileSource.Api;

        this.init(newUrl, apiUser, apiPass);
    }

    /**
     * Send a new perspective configuration to the CM
     * @param newConfiguration 
     * @param updateFileSource 
     * @param callback 
     */
    sendNewConfigSeed(newConfiguration: any, updateFileSource: (fileSource: EFileSource,
        changeItemState?: Function, apiURL?: string, apiUser?: string, apiPass?: string) => void, callback: Function) {

        this.setLoadingState({ isActive: true, msg: `${this.translation?.loadingText.sendingPerspectiveConfig}` });

        // For some reason, CM receives an empty object when axios does the post request.
        if (this.usingAPI) {

            fetch(`${this.axios.defaults.baseURL}${this.confSeedPOSTurl}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${btoa(this.apiUsername + ':' + this.apiPassword)}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(newConfiguration)
            })
                .then(res => res.json())
                .then((res) => {
                    console.log("response: ->")
                    console.log(res);

                    callback();
                })
                .catch((err) => {
                    console.log(err)

                    window.alert(err);
                    callback();
                }).finally(() => {
                    this.setLoadingState({ isActive: false });
                });;

        } else {
            this.setLoadingState({ isActive: false });
            callback();
        }
    }

    /**
     * Request a perspective configuration file so the user can download it
     * @param perspectiveId 
     * @param callback 
     */
    requestPerspectiveConfig(perspectiveId: PerspectiveId, callback: Function) {
        this.setLoadingState({ isActive: true, msg: `${this.translation?.loadingText.requestPerspectiveConfig}` });

        if (this.usingAPI) {
            this.requestToUrl(`${this.perspectiveConfigGETurl}${perspectiveId.id.split(" ")[0]}`)
                .then((response: any) => {
                    if (response.status === 200) {

                        //Create a link that automaticaly is clicked and downloads the response.data json
                        const aElement = document.createElement('a');
                        aElement.setAttribute('download', `${perspectiveId.name}.json`);
                        const href = URL.createObjectURL(new Blob([JSON.stringify(response.data, undefined, 2)], { type: "text/json" }));
                        aElement.href = href;
                        aElement.setAttribute('target', '_blank');
                        aElement.click();
                        aElement.remove();
                        URL.revokeObjectURL(href);

                    } else {
                        throw new Error(`Error while requesting perspective config ${perspectiveId}: ${response.statusText}`);
                    }
                })
                .catch((error: any) => {
                    callback(undefined);

                    console.log(`Perspective file with id: (${perspectiveId}) was not found: ${error}`);
                    console.log(error);
                    alert(`Perspective file with id: (${perspectiveId}) was not found: ${error.message}`);

                }).finally(() => {
                    this.setLoadingState({ isActive: false });
                });
        }
    }

    /**
     * Delete a perspective from the CM dataBase
     * @param perspectiveId id of the perspective to remove
     */
    deletePerspective(perspectiveId: string) {
        if (this.usingAPI) {
            this.axios.delete(`${this.deletePerspectiveDELurl}/${perspectiveId}`)
                .finally(() => {
                    this.setLoadingState({ isActive: false });
                });
        }
    }
}
/**
 * Add a delay
 * @param seconds 
 * @returns 
 */
function delay(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}