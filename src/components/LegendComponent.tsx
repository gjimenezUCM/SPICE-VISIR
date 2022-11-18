/**
 * @fileoverview This file creates a dropdown that show/hides the legend of the app. This also creates the content.
 * The legend allows the user to understand the relations between the node's dimensions and the value of 
 * its explicit communities.
 * The user can also toggle any Legend value to hide all node's with that value.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { DimAttribute, Dimensions, nodeConst } from '../constants/nodes';
import { EButtonState } from '../constants/viewOptions';
//Packages
import React from "react";
//Local files
import { Dropdown } from '../basicComponents/Dropdown';
import { Button } from '../basicComponents/Button';
import { ColorStain } from '../basicComponents/ColorStain';
import { ILegendData } from '../constants/auxTypes';

const columnTittle: React.CSSProperties = {
    whiteSpace: "nowrap",
    margin: "5px 10px",
    paddingBottom: "5px",
    borderBottom: "black 1px inset",
    overflow: "hidden",
    textOverflow: "ellipsis",
    cursor: "default"
}

const buttonContentRow: React.CSSProperties = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
}

const columnStyle: React.CSSProperties = {
    borderRight: "1px solid black",
    width: "15vw",
    textAlign: "center",
}

interface LegendTooltipProps {
    /**
     * Data source to create the legend content.
     */
    legendData: ILegendData | undefined;
    /**
     * Configuration of the legend with the explicit communities that should be hidden/shown.
     */
    legendConf: Map<string, boolean>;
    /**
     * Function to change the legend configuration that changes how nodes will be seen.
     */
    onLegendClick: Function;
}

/**
 * Dropdown component that toggles the legend of the active perspectives. The legend can be clicked to toggle some
 * nodes visibility based on their explicit community values.
 */
export const LegendComponent = ({
    legendData,
    legendConf,
    onLegendClick,
}: LegendTooltipProps) => {

    if (legendData !== undefined && legendData.dims !== undefined && legendData.dims.length > 0) {

        const legendRows: React.ReactNode[] = getLegendButtons(legendData.dims, legendConf, onLegendClick);
        const anonRows: React.ReactNode = getAnonButtons(legendData.anonGroup, legendData.anonimous, legendConf, onLegendClick);

        const legendContent =
            <React.Fragment key={0}>
                <div key={1} className='row' style={{ direction: "ltr" }}>
                    {legendRows}
                </div>
                <div key={2} className='row' style={{ direction: "ltr" }}>
                    {anonRows}
                </div>
            </React.Fragment>
        return (
            <div className="legend-container">
                <Dropdown
                    items={[legendContent]}
                    content="Legend"
                    extraClassButton="plus primary"
                    closeWhenOutsideClick={false}
                />
            </div>
        );

    } else {
        return (<Dropdown
            items={[]}
            content="Unactive Legend"
            extraClassButton="plus primary"
            closeWhenOutsideClick={false}
        />)

    }
};

/**
 * Get all the buttons that creates the legend tooltip.
 * @param legendData Data that creates the legend.
 * @param legendConf Configuration of what is active/inactive in the legend.
 * @param onClick Function executed when a legend row is clicked.
 * @returns all the column buttons.
 */
function getLegendButtons(legendData: DimAttribute[], legendConf: Map<string, boolean>,
    onClick: Function): React.ReactNode[] {

    const rows = new Array<React.ReactNode>();

    for (let i = 0; i < legendData.length; i++) {
        if (legendData[i].active) {
            const buttonsColumn = new Array<React.ReactNode>();

            for (let j = 0; j < legendData[i].values.length; j++) {
                const value = legendData[i].values[j];

                buttonsColumn.push(
                    <Button
                        key={i * 10 + j}
                        content={getButtonContent(value, legendData[i].dimension, j)}
                        state={legendConf.get(value) ? EButtonState.active : EButtonState.unactive}
                        extraClassName={"btn-legend btn-dropdown"}
                        onClick={() => {
                            legendConf.set(value, !legendConf.get(value));

                            const newMap = new Map(JSON.parse(
                                JSON.stringify(Array.from(legendConf))
                            ));

                            onClick(newMap);
                        }} />
                );
            }

            const colum =
                <div className='col' style={getLegendColumnStyle(i === legendData.length)}
                    key={i}>
                    <h3 style={columnTittle} title={legendData[i].key}>{legendData[i].key} </h3>
                    {buttonsColumn}
                </div>;

            rows.push(colum);
        }
    }

    return rows;
}

/**
 * Returns the content of a legend button based on data from a community and its related values and dimensions.
 * @param value value of the attribute of this row.
 * @param dim dimension of the attribute of this row.
 * @param index index of the community.
 * @returns a react component.
 */
const getButtonContent = (value: string, dim: Dimensions, index: number): React.ReactNode => {
    switch (dim) {
        case Dimensions.Color:
            return (
                <div title={value} className="row" style={{ alignItems: "self-end" }} key={index}>
                    <div className="col-9" style={buttonContentRow}> {value} </div>
                    <div style={{ width: "20px", height: "20px" }}>
                        <ColorStain
                            color={nodeConst.nodeDimensions.getColor(index)}
                            scale={1.3}
                        />
                    </div>
                </div>

            );

        case Dimensions.Shape:
            return (
                <div title={value} className="row" style={{ alignItems: "self-end" }} key={index}>
                    <div className="col-9" style={buttonContentRow}> {value} </div>
                    <div className={`legend-shape ${nodeConst.nodeDimensions.getShape(index).name}`}></div>
                </div>
            );
        case Dimensions.Border:
            return (
                <div title={value} className="row" style={{ alignItems: "self-end" }} key={index}>
                    <div className="col-9" style={buttonContentRow}> {value} </div>
                    <div className="col-3 box" style={{ borderColor: nodeConst.nodeDimensions.getBorder(index), borderWidth: "4px" }}></div>
                </div>
            );
        default:
            return <div> ERROR WHILE CREATING THIS ROW CONTENT</div>
    }
}

function getAnonButtons(anonGroups: boolean, anonymous: boolean, legendConf: Map<string, boolean>,
    onClick: Function): React.ReactNode {

    let output: React.ReactNode = undefined;

    if (anonymous) {
        let buttonState: EButtonState = EButtonState.unactive;
        const currentState = legendConf.get(`${nodeConst.anonymousGroupKey}User`);

        if (currentState !== undefined && currentState) {
            buttonState = EButtonState.active;
        };

        output =
            <div key={2} className='col'>
                <h3 key={1} style={columnTittle} title="Anonymous Users" >  Anonimous Users </h3>
                <Button
                    key={2}
                    content={<div className='row'>
                        <div> Users without any explicit data </div>
                        <span style={{ width: "5px" }} />
                        <img alt={"Anonimous user icon"} src={nodeConst.defaultAnon} style={{ height: "20px" }}></img>
                    </div>}
                    state={buttonState}
                    extraClassName={"btn-legend btn-dropdown"}
                    onClick={() => {
                        legendConf.set(`${nodeConst.anonymousGroupKey}User`, !currentState);

                        const newMap = new Map(JSON.parse(
                            JSON.stringify(Array.from(legendConf))
                        ));

                        onClick(newMap);
                    }} />
            </div >;
    }
    return output;
}

function getLegendColumnStyle(isLast: boolean): React.CSSProperties {
    let newStyle: React.CSSProperties = (JSON.parse(JSON.stringify(columnStyle)));

    if (isLast) {
        newStyle.borderRight = "none";
    }

    return newStyle;
}