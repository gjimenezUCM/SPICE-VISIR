# VISIR

![VISIR Logo](public/images/visir-readme-logo.png)

VISIR (VISualization for Interpretation and Reflection) is a tool that enables museum curators the detection, visualization, and explanation of communities needed in the SPICE IRL model. The app is available at:

- <https://gjimenezucm.github.io/SPICE-VISIR/>. 
- <https://spice.fdi.ucm.es/visir/>


_The research leading to these software has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement SPICE No 870811_


![SPICE logo](public/images/spice-logo.png)


# How to run the application localy
There are 2 ways of running the application. Docker allows for an easy one command instalation, Node.js allows to introduce new testing files. Both options start with these steps.

Prerequisite: [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell) or any similar command prompt to execute commands.

1. Download all the code of [this repository](../../archive/refs/heads/main.zip).
2. Go to the project forlder inside PowerShell or similars.

## Using Node.js and NPM. 
Prerequisite: [Node](https://nodejs.org/en/).

3. Use powershell to go to the downloaded program folder and install all packages with the following command `npm install`
4. Launch the local server with the following command `npm run start`
5. The app will automaticaly be opened by your web browser in the localhost port 3000. If it hasn't opened, try manualy opening the page `http://localhost:3000/`
## Using Docker (development)
Prerequisite: [Docker](https://www.docker.com/).

1. Run the docker container with the following command `docker-compose -f docker-compose.dev.yml --env-file dev.env up` inside the project folder.
2. The app will be automaticaly launched in `http://localhost:5500/` once the previous command finishes, so open that URL in your web browser (see `dev.env` file for modifying exposed port).


## Using Docker (deployment)
Prerequisite: [Docker](https://www.docker.com/).

1. Create a `.env` file following the instructions in the `template.env` file
2. Run the docker container with the following command `docker-compose --env-file .env up` inside the project folder.
3. The app will be automatically launched in `http://localhost:5500/` with a Ngnix server and with suppport for Trafik inverse proxy.

______________________
# Easy how to use the app.
0. By default if the URL contains perspective1 and/or perspective2 variables, the app will try to request and activate those perspectives. These URL variables are optional, there are other ways to pick between perspectives.
    1. An example of a URL with IDs is the following "http://localhost:3000/?perspective1=5&perspective2=6" Where 5 and 6 are the id of the files.

1. First you need to tell the app where the perspectives you want to see are located. With the FileSource dropdown you can pick between some options (using the API files is the default option).
    1. Keep in mind, the moment file source is changed, the app will disable all active perspectives and will try to reload the URL perspectives if they exist.
    2. Currently the API server is not active, so unless you launch it localy or you know an URI with the API server, this option wont work.
    3. If its planed to use the API server, VISIR by default uses the local URI. To change this it's necesary to open the API dropright inside File Source dropdown. Pressing the update button at the right will load the textbox URL as the API server.

2. Now you need to pick what perspectives you want to see. One way is the URL parameters as mentioned, the other way is to use the select perspective dropdowns. Clicking the name of the desired perspective will disable the prevously active perspective, if there is one, and load the new one.
    1. If a perspective is highlighted in red, it means its the current active perspective in this side of the app.
    2. If a perspective inside a dropdown is greyed out, it means its active in the other dropdown and you cant edit it from this dropdown.

3. Now that the perspective is active, if you click a node of any network, all networks will select that node, will show the node's info in the nearby dataTables and will zoom in to that node and its connected nodes. A tooltip will be shown nearby the node to represent similar info.

4. If you click a bounding box and not a node, two diferent things will happen depending on which network was clicked:
    1. The network that was clicked will zoom in to all nodes inside the bounding box, and will show information about the community related to the bounding box.
    2. The network that was *not* clicked, will search for all nodes inside the clicked bounding box, and if they exist in this network, they will be highlighted and the view will zoom to them

5. If you neither click a node or a bounding box, all datatables and tooltips will be cleared and a zoom out will bring the network to the original zoom.

6. All nodes will have diferent colours and shapes. Legend dropdown allows you to understand what does every colour/shape means. If you click any of the legend rows, all nodes that contain that characteristic will be made less obstrusive to the visualization.

## Other options
Options dropdown has several diferent options to change how the visualization is shown.

- Hide node labels is activated by default. Hides the label and id of the nodes both in the dataTables/tooltip and in the visualized network.

- Hide unselected Edges. Hide all edges excepts the ones that are conected to the current selected node.

- Minimum Similarity. Delete all edges that doesnt have a minimum similarity value. *Can improve performance if increased*

- Remove % of edges. Directly removes a % of all edges of the network, chosen randomly. *Can improve performance if increased*

- Activate node borders. Add a third visualization dimension to all nodes when possible. Depending on one characteristic, all nodes' border colour will change. The legend dropdown will be updated with this new characteristic and the new border colours.

______________________
## How to add more testing files
There is a format guide for new testing files [here](https://github.com/MarcoExpPer/SPICE-visualization-ReactPort/blob/main/public/data/dataFormatGuide.txt).

To add testing files using LocalFile file source options, you need to do the following changes. 

- Localfiles: Move any new file to ./public/data/ directory. The new file must follow the required format explained in ./public/dataSchemas/perspectiveData.json. The id of the perspective must be queal to the name of the file. It's also necesary to add the id and the name to the ./public/data/dataList.json file. 

Once all of these changes are completed, the node.js instalation should already see the changes on the search engine. Reloading the page may help.
Docker instalation will need to re-execute the instalation process to create the ocker container with the changes. It's recommended to remove all previously loaded docker containers and images of this application.
_______________________

## Preconfiguration available

- Change default API url: Update the parameter `API_URI` in the app config file located here [./src/appConfig.json](./src/appConfig.json) 

- Change default Docker deploy port: Update the parameter `DOCKER_PORT` from the .env file located here [./.env](./.env)

- Change default NPM deploy port: Update the parameter `PORT` from the .env file located here [./.env](./.env)

_______________________

# Complete user guide

In this section all the app will be explained from a user point of view.

## Loading
When the app starts, it may request files to the CM (Community Model). If the CM is not well defined, unavailable or is not correctly configured, an error will pop explaining what was the problem. Accept the error to continue using the  app. It's not a critical problem if the CM is not intended to be used.

## Toolbar

From left to right: 
- **The first button** with VISIR logo and name will refresh the web page to its default value, resetting any visualization configuration to default.
- **Cog Icon** is a dropdown with different VISIR options.  
The first two options choose where the perspective's files will be picked from. The selected option is highlighted in red.
    - **Use local files** use the files preloaded in the app.
    - **Use URL** is a text area where u can write the URL to the CM, click enter, and the app will try to connect to it.  

    The following options are different ways to change the data shown in the visualization. Options highlighted in red are active.  

    - **Show node labels** will show the node labels/id in the visualization.
    - **Hide unselected edges** will toggle edge visibility of the edges not directly connected to the clicked node/user. If no node is clicked, all edges will be hidden.
    - **Minimum similarity** slider allows to remove from the visualization all edges that are less than the value selected. Higher values can improve performance.
    - **Number of relevant artworks**. In the visualization, clicking a user's community will show what artworks are relevant to that community. This slider allows to pick the maximum number of artworks shown.
- **Floppy disk Icon** is a button that opens the save perspective menu. To close this menu click the top-right **X** button.
    - In this menu, any number of perspectives may be selected in order to download their configuration file from the CM. If the CM is not being used, the download button will do nothing.
    - **Toggle All** checkbox allows to easily select or deselect all perspectives.  

- **Screwdriver and wrench Icon** is a button that opens the perspective builder. The perspective builder is a menu that allows to create personalized perspectives based on the CM's data. If there's no CM available, the menu will work with some default options, but no perspective will actually be created or sent. To close this menu click the top-right **X** button. Perspective builder will be explained in detail in a [following section](#Perspective-Builder).

    
- **Select perspective A** dropdown let the user pick what perspective want to visualize. When there are no available perspectives, it will be white and barely visible. When some perspectives are available, first it will make a little animation while changing its color to red.
    - The dropdown has a row for each of the available perspectives.
    - If a perspective is highlighted in red, it's the current active perspective in this dropdown. Clicking it will deactivate it.
    - If a perspective name is semitransparent and a bit darker, it's a perspective active in the other dropdown, and it won't respond to user clicks.
    - Any other perspective is available for visualization and clicking it will change the active perspective to the new clicked one.

- **Update icon** is a button to refresh the available perspectives. It works with either with local files or with CM as file source.

- **Select perspective B** dropdown works exactly the same as Select perspective A.

    When there is a perspective selected on each of the dropdowns, both perspectives will be visualized side to side. The perspective at the left will be related to the active perspective in the left dropdown, "Select perspective A", and the perspective at the right will be related to the active perspective in the right dropdown, "Select perspective B"

    Two different perspectives can't be active at the same time if they have different key values in their legend.

    When two perspectives are selected, the collapse buttons will appear.
- **Collapse Buttons** are two dark buttons with "<" ">" icons inside. These buttons collapse the perspectives in the direction the arrow points, making the perspective in that side smaller, and the one at the other side bigger.

- **Legend dropdown** will show the legend of the current actives perspectives. If there are no active perspectives, will be disabled.
Once is active, the legend will show all the explicit communities of the users and the value of each of them. Clicking any of the values in the legend will reduce the visibility of all the users/nodes with that explicit value. 

## Perspective Builder

As previously stated, the perspective builder allows to create new perspectives to visualize in VISIR. It's necessary a connection to a CM in order to see the created perspectives.

- **Main Sentence** Below the red line, there is a sentence that dictates how the new perspective will work. 
    - **First dropdown** allows to pick the similarity level of the next dropdown selected option.
    - **Second dropdown** allows to pick what parameter to process based on the previously selected similarity. Depending on the CM, some of the available options are Emotions, Sentiments or Values.
    - **Third dropdown** works similar to the first dropdown, pun intended. This time the similarity level is about the artworks/beliefs or concepts of the perspective.
    - **Forth dropdown** is only active and visible if same is selected in the previous dropdown and if there is any artwork available in the CM. The artwork selected indicates what artwork will be focused while creating the same-artworks perspective.
- **Legend Attributes** is a box with several rows of clickable attributes. The active checkboxes will dictate what legend attributes will the perspective use.
- **Artworks Attributes** when similar/dissimilar artworks are selected, this box will be available. Active checkboxes decide what attribute will be used to compare similar/dissimilar artworks
- **Perspective Name** text allows to write a personalized name for the created perspective.
- **Send Perspective** button, as expected, sends the perspective to the CM and automatically refresh the available perspectives.

**Dev Mode** button swaps the menu to it's expert functionality.

Above the red line we can see two new options.
- **Dropdown** to pick what algorithm will be used in the clustering that makes the perspective.
- **Explanability weight** slider. It allows to pick the percentage of the minimum weight of users that must be represented by the same value
of contributions attributes (emotions, values, sentiments) to make such attribute explainable.
A big value increase the number of communities and maybe, increase the number of users without community.

If similar/dissimilar is selected in the third dropdown, instead of the dropdown to pick artworks, a new slider will appear.
- **Similar/dissimilar treshold similarity** slider selects what is the minimum similarity between artworks from two interactions to calculate the similarity between them.(Otherwise its assume as similar)

- **Black << button** shows the json sent to the CM. Works mostly as a debug tool to check everything works fine. But it's also possible to copy that json text into a file to save that configuration.

### Perspective representation

All users will be represented with a node of a determined size,color and shape, distributed in different bounding boxes of different colrs.

The **color dimension** represents one of the nodes' explicit communities while the specific color of a node represents the value of that explicit community.
The **shape** of a node works exactly the same, but with another explicit community and of course, shapes instead of colors.

There are some users that don't have any explicit community value, we call these users **Anonymous** and represent them with a "?" inside a circle.

The colored **bounding boxes** means that all nodes inside it are in the same community obtained via clustering. If some nodes are grouped but its bounding box is transparent, it means those nodes are not placed in any community.

Finally, the **size** of the node represents if its a representative citizen of the community.

The lines that go from a node to another node represent that those nodes are connected by a similarity value. The value is equal or higher than the value selected in the minimum similarity slider.

## Clicking the network

Once any perspective is active, the user can interact with the network by clicking it.

- **Clicking a node** will highlight all nodes connected to the focused node and will zoom to all of them. The same will happen in the other active perspective. This will also show node's information and its community on the side dataColumns and will show a little tooltip with some of the node's info.
- **Clicking** one of the **bounding boxes** (and not a node inside the box), will highlight and zoom to all nodes in the box. The other active perspective will highlight the same nodes in it's own perspective and distribution. DataColumns will show information about this community and will explain why it was created.
- **Not clicking** a node nor a bounding box will zoom to fit all nodes inside the viewport and will clear all the dataColumns.

## DataColumn

The data column shows different data based on the click interaction of the user. 
- **Citizen information**: Citizen information shows the node's label (if its shown by the options) and also all its explicit communities and values. 
Then an accordion will show the different interactions the user has gotten with different artworks that were also specially used to make this user part of a community.
After the accordion, a new accordion will include the user's interactions that are not related to the user community.
- **Interaction**: An interaction is a little box that contains the information about an artwork or a similar entity. Its title, date, author and an image if possible. Inside a red dashed box, there is a commentary of the user. After that, we can see the representation of the different sentiments and feelings the user felt about the artwork.
- **Community information**: The community information will show the name of the community, the number of citizens inside the community and how many of them are anonymous. After the basic information, the dataColumn will show different community explanations that changes from perspective to perspective.

    There are different types of explanations trying to explain why this community exists and what are the relations between the users inside. The order and quantity of these explanations can also change from one perspective to another and even from one community to another from the same perspective.

    - **Explicit Explanation**:

    Shows a bar divided in portions that represents an explicit community. Each portion represents one of the explicit community value. Hovering above a portion will show the name of the value.
    - **Representative User Explanation**:
    Shows the node information of the representative user/node.
    - **Implicit Explanation map**: 
    Shows a percentage distribution of an implicit attribute as a wordCloud and as a treeMap. Clicking any treeMap value will filter all communities in the visualization that have such value as the maximum value of the attribute.
    - **Implicit Explanation list**: 
    Shows a list with the implicit attributes of the community. Each row of the list starts with a button that can be clicked to filter all communities that have the clicked value.
    - **Implicit Explanation Accordion**: 
    Shows an accordion with the different attributes of the community. Each accordion item includes the information of the artworks related to such attribute. As before, a button may be clicked to filter all communities that have the same clicked value.


# LICENSE

The content of this repository is distributed under [Apache 2.0 License](LICENSE).


*Last update of the content of this doc: 26/04/2023*




 
