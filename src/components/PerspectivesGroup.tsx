/**
 * @fileoverview This file creates the perspective view component and broadcast diferent options and items between all 
 * active perspectives
 * 
 * This component also holds and resets the managers shared between the perspectives.
 * 
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { IPerspectiveData, EPerspectiveVisState } from "../constants/perspectivesTypes";
import { ViewOptions, EAppCollapsedState } from "../constants/viewOptions"
import { ESelectedObjectAction, selectedObjectReducer, IStateFunctions, ILegendDataAction, IAttribute } from "../constants/auxTypes";
//Packages
import { useEffect, useReducer, useState } from "react";
//Local files
import { Tooltip } from "../basicComponents/Tooltip";
import { PerspectiveView } from "./PerspectiveView";
import NodeDimensionStrategy from "../managers/nodeDimensionStrat";
import { ITranslation } from "../managers/CTranslation";

const perspectiveContainers: React.CSSProperties = {
    display: "flex",
    marginBottom: "5vh",
    paddingBottom: "1vh",
}

const widthStyle: Map<EPerspectiveVisState, React.CSSProperties> = new Map([
    [EPerspectiveVisState.unactive, { width: "0%" }],
    [EPerspectiveVisState.activeBoth, { width: "50%" }],
    [EPerspectiveVisState.activeSingle, { width: "100%" }],
    [EPerspectiveVisState.activeBig, { width: "80%" }],
    [EPerspectiveVisState.collapsed, { width: "20%" }],
])

interface PerspectivesGroupProps {
    leftPerspective?: IPerspectiveData,
    rightPerspective?: IPerspectiveData,

    collapsedState: EAppCollapsedState,
    /**
     * View options for all networks.
     */
    viewOptions: ViewOptions,
    /**
     * Function to setup the legend's data.
     */
    setLegendData: React.Dispatch<ILegendDataAction>,

    translation: ITranslation | undefined;

    /**
     * Function to cancel a perspective by ID, removing it from the visualization 
     */
    cancelPerspective: (idToCancel: string) => (void),
}

/**
 * Component that draws both perspective, holds mutual components and broadcast information between pespectives.
 */
export const PerspectivesGroups = ({
    leftPerspective,
    rightPerspective,
    collapsedState,
    viewOptions,
    setLegendData,
    translation,
    cancelPerspective,
}: PerspectivesGroupProps) => {

    const [dimensionStrategy, setDimensionStrategy] = useState<NodeDimensionStrategy | undefined>();
    const [networkFocusID, setNetworkFocusID] = useState<string | undefined>();
    //When a user clicks somewhere in a perspective, whatever it clicks will be the selected object shared between perspectives
    const [selectedObject, setSelectedObject] = useReducer(selectedObjectReducer, undefined);
    //When a user clicks a community's attribute from the data column, the clicked attribute will be shared between perspectives
    const [selectedAttribute, setSelectedAttribute] = useState<IAttribute | undefined>();

    const sf: IStateFunctions = {
        setLegendData: setLegendData,
        setDimensionStrategy: setDimensionStrategy,
        setNetworkFocusId: setNetworkFocusID,
        setSelectedObject: setSelectedObject,
        setSelectedAttribute: setSelectedAttribute,
    }

    //When the collapsed state changes, we clear both datatables
    useEffect(() => {
        setSelectedObject({ action: ESelectedObjectAction.clear, newValue: undefined, sourceID: "0" });
        setNetworkFocusID(undefined);
    }, [collapsedState]);

    //When no perspective is loaded or all are unloaded, we clear all base configuration
    useEffect(() => {
        if (leftPerspective === undefined && rightPerspective === undefined && dimensionStrategy !== undefined) {
            setLegendData({ type: "reset", newData: false });
            setSelectedObject({ action: ESelectedObjectAction.clear, newValue: undefined, sourceID: "0" });
            setNetworkFocusID(undefined);
            setDimensionStrategy(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leftPerspective, rightPerspective, dimensionStrategy]);

    //Necesary to toggle the border visualization. Currently unused because border option currently is removed from the application
    useEffect(() => {
        if (dimensionStrategy !== undefined)
            dimensionStrategy.toggleBorderStat(viewOptions.border);

    }, [viewOptions.border, dimensionStrategy]);

    const { leftState, rightState } = calculatePerspectiveState(leftPerspective, rightPerspective, collapsedState);

    const leftComponent = leftPerspective === undefined ? "" :
        <PerspectiveView
            perspectiveData={leftPerspective}
            viewOptions={viewOptions}
            sf={sf}
            selectedObject={selectedObject}
            dimStrat={dimensionStrategy}
            networkFocusID={networkFocusID}
            perspectiveState={leftState}
            unique={rightPerspective === undefined}
            translation={translation}
            cancelPerspective={cancelPerspective}
            selectedAttribute={selectedAttribute}
        />

    const rightComponent = rightPerspective === undefined ? "" :
        <PerspectiveView
            perspectiveData={rightPerspective}
            viewOptions={viewOptions}
            sf={sf}
            selectedObject={selectedObject}
            dimStrat={dimensionStrategy}
            networkFocusID={networkFocusID}
            perspectiveState={rightState}
            mirror={true}
            unique={leftPerspective === undefined}
            translation={translation}
            cancelPerspective={cancelPerspective}
            selectedAttribute={selectedAttribute}
        />

    return (
        <div style={perspectiveContainers}>
            < Tooltip
                selectedObject={selectedObject}
                showLabel={viewOptions.showLabels}
                translation={translation}
            />
            <div style={widthStyle.get(leftState)}
                key={leftPerspective === undefined ? -1 : `first${leftPerspective.id}`}>
                {leftComponent}
            </div>

            <div style={widthStyle.get(rightState)}
                key={rightPerspective === undefined ? -2 : `second${rightPerspective.id}`}>
                {rightComponent}
            </div>
        </div>
    );
};

/**
 * Calculates the Perspective state based on the application collapsed state. If only one perspective is defined,
 * the other perspective will be singleActive no matter the collapsed state value.
 * @param leftPerspective data of the left perspective.
 * @param rightPerspective data of the right perspective.
 * @param collapsedState collapsed state of the application.
 * @returns returns two perspective states, {left, right}
 */
function calculatePerspectiveState(leftPerspective: IPerspectiveData | undefined, rightPerspective: IPerspectiveData | undefined,
    collapsedState: EAppCollapsedState) {

    let leftState: EPerspectiveVisState = EPerspectiveVisState.unactive;
    let rightState: EPerspectiveVisState = EPerspectiveVisState.unactive;

    switch (true) {
        case leftPerspective === undefined:
            leftState = EPerspectiveVisState.unactive;

            if (rightPerspective === undefined)
                rightState = EPerspectiveVisState.unactive;

            else
                rightState = EPerspectiveVisState.activeSingle;
            break;

        case rightPerspective === undefined:
            leftState = EPerspectiveVisState.activeSingle;
            rightState = EPerspectiveVisState.unactive;
            break;

        case collapsedState === EAppCollapsedState.toTheLeft:
            leftState = EPerspectiveVisState.collapsed;
            rightState = EPerspectiveVisState.activeBig;

            break;

        case collapsedState === EAppCollapsedState.toTheRight:
            leftState = EPerspectiveVisState.activeBig;
            rightState = EPerspectiveVisState.collapsed;

            break;

        case collapsedState === EAppCollapsedState.unCollapsed:
            leftState = EPerspectiveVisState.activeBoth;
            rightState = EPerspectiveVisState.activeBoth;
            break;
    }
    return { leftState, rightState };
}


