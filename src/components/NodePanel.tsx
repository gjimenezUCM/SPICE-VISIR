/**
 * @fileoverview This file creates a panel that shows diferent information about an user. If no user is provided, the panel will be empty.
 * - First it shows the explicit community values of the user.
 * - If showLabels is active, it will show the user's label.
 * - All user's implicit community values will be shown if they exist.
 * - Additionaly,  the user's interactions will be shown in two diferent accordions. One with the interactions related to
 * the user community, the ones that were used in the clustering. And another accordion with the rest of the interactions, it 
 * may be empty.
 * 
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { anyProperty, IArtworkData, IInteraction, IStringNumberRelation, IUserData }
    from "../constants/perspectivesTypes";
//Packages
import React from "react";
//Local files
import { InteractionPanel } from "../basicComponents/Interaction";
import { Accordion } from "../basicComponents/Accordion";
import { ITranslation } from "../managers/CTranslation";
import { getWordClouds } from "./DataColumn";

const sectionTittleStyle: React.CSSProperties = {
    fontSize: "1.2em",
    fontWeight: "bold",
    fontFamily: "var(--contentFont)",
    lineHeight: "135%",
    width: "100%",
    margin: "0.5rem 0px",
    color: "var(--title)",
}

const frenchIndent: React.CSSProperties = {
    textIndent: "-30px",
    paddingLeft: "40px"
}

interface NodePanelProps {
    tittle: String;
    node: IUserData | undefined;
    showLabel: boolean;
    artworks: IArtworkData[];
    translation: ITranslation | undefined;
}

/**
 * UI component that shows diferent types of data in a column
 */
export const NodePanel = ({
    tittle,
    node,
    showLabel,
    artworks,
    translation,
}: NodePanelProps) => {

    const tittleContainer = <div key={0} style={sectionTittleStyle}> {tittle} </div>;
    let content: React.ReactNode[] = new Array<React.ReactNode>();

    if (node !== undefined) {

        if (showLabel) {
            content.push(<p style={frenchIndent} key={1}> <strong> {`${translation?.dataColumn.userLabelLabel}:`} </strong> &nbsp; {node.label} </p>);
        }

        const keys = Object.keys(node.explicit_community);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = node.explicit_community[keys[i]];

            content.push(
                <p key={2 + i} style={frenchIndent}> <strong> {key} </strong> &nbsp; {value} </p >);
        }


        content.push(<div key={-2}> {getImplicitCommunityValues(node?.implicit_community)} </div>)

        content.push(<div key={-1} style={{ margin: "0.5rem 0px" }}> {getInteractionsAccordion(node, artworks, translation)} </div>);
    }

    if (content.length === 0) {
        return <React.Fragment />;
    } else {
        return (
            <React.Fragment>
                <div style={{ borderBottom: "1px #dadce0 inset", paddingBottom: "3px" }}>
                    {tittleContainer}
                    {content}
                </div>
            </React.Fragment>
        )
    }
};

/**
 * Returns two diferent accordions that includes all the node's interactions. One accordion has the community related 
 * interactions, the other has the rest of the user interactions
 * @param node source node
 * @param artworks all artworks' data
 * @returns a react component with the node's interactions accordion.
 */
function getInteractionsAccordion(node: IUserData | undefined, artworks: IArtworkData[], translation: ITranslation | undefined) {
    let content: React.ReactNode[] = [];

    if (node !== undefined) {

        if (node.community_interactions !== undefined) {

            const { interactionPanels, tittles }: { interactionPanels: React.ReactNode[]; tittles: string[]; } =
                getInteractionsPanel(node.community_interactions, artworks);

            if (interactionPanels.length > 0) {
                content.push(
                    <div key={1} style={{ margin: "0.5rem 0px" }}>
                        <strong>
                            {`${translation?.dataColumn.relatedContributions}`}
                        </strong>
                        <Accordion
                            items={interactionPanels}
                            tittles={tittles}
                        />
                    </div>);
            }
        }

        if (node.no_community_interactions !== undefined) {
            const { interactionPanels, tittles }: { interactionPanels: React.ReactNode[]; tittles: string[]; } =
                getInteractionsPanel(node.no_community_interactions, artworks);

            if (interactionPanels.length > 0) {
                content.push(
                    <div key={0} style={{ margin: "0.5rem 0px" }}>
                        <strong>
                            {`${translation?.dataColumn.otherContributions}`}
                        </strong>
                        <Accordion
                            items={interactionPanels}
                            tittles={tittles}
                        />
                    </div>);
            }
        }

    }

    return content;
}

/**
 * Creates and returns a fully created accordion with the user interactions
 * @param interactions interactions to include in the accordion
 * @param artworks dataBase with all artworks to show its data in the panels
 * @returns 
 */
function getInteractionsPanel(interactions: IInteraction[], artworks: IArtworkData[]) {
    const tittles: string[] = new Array<string>();
    const interactionPanels: React.ReactNode[] = new Array<React.ReactNode>();

    for (let i = 0; i < interactions.length; i++) {

        const interaction = interactions[i];
        const artwork = artworks.find((element: IArtworkData) => { return element.id === interaction.artwork_id; });

        if (artwork !== undefined) {
            tittles.push(artwork.tittle);
            interactionPanels.push(
                <InteractionPanel
                    artworksData={artworks}
                    interaction={interaction} />
            );
        }
    }
    return { interactionPanels, tittles };
}

/**
 * Returns a list with the user's implicit values
 * @param implicit_communities user implicit values
 * @returns 
 */
function getImplicitCommunityValues(implicit_communities: anyProperty): React.ReactNode {

    const keys = Object.keys(implicit_communities);
    if (keys.length === 0) {
        return <></>
    }

    const data: React.ReactNode[] = [];

    const lastData: React.ReactNode[] = [];
    const tittles: string[] = [];

    for (let i = 0; i < keys.length; i++) {
        //Its a dicctionary variable that its represented with a word cloud
        if (typeof implicit_communities[keys[i]] === "object") {
            const wordData: IStringNumberRelation[] = [];

            const objectKeys = Object.keys(implicit_communities[keys[i]]);
            for (let oKey in objectKeys) {
                wordData.push({
                    value: objectKeys[oKey],
                    count: implicit_communities[keys[i]][objectKeys[oKey]]
                });
            }

            tittles.push(keys[i]);

            lastData.push(
                <div key={i}>
                    {getWordClouds(wordData, true, true, true)}
                </div>);

        } else {
            //Its a simple variable represented with plain text
            data.push(<p key={i} style={frenchIndent}> <strong> {keys[i]}: </strong> &nbsp; {implicit_communities[keys[i]]} </p >);
        }
    }

    return (
        <React.Fragment>
            {data}
            <Accordion
                items={lastData}
                tittles={tittles}
            />
        </React.Fragment>
    )

}
