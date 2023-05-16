/**
 * @fileoverview This file creates a Tooltip positioned close to an object. 
 * The tooltip is a floating container with some transparency, some information about a selected object and a button to close it. 
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ISelectedObject } from "../constants/auxTypes";
import { ICommunityData, IUserData } from "../constants/perspectivesTypes";
//Packages
import React, { useEffect, useRef, useState } from "react";
//Local files
import { Button } from "./Button";
import { ITranslation } from "../managers/CTranslation";

interface TooltipProps {
    /**
     *  All important information about the tooltip.
     */
    selectedObject: ISelectedObject | undefined;
    /**
     * If the tooltip should hide users' labels and ids when shown.
     */
    showLabel: boolean;

    translation: ITranslation | undefined;
    isTooltipActive: boolean;
}

/**
 * UI component that creates a tooltip based on the selectedObject position.
 */
export const Tooltip = ({
    selectedObject,
    showLabel,
    translation,
    isTooltipActive,
}: TooltipProps) => {
    const [isActive, setActive] = useState<Boolean>(isTooltipActive);
    const [yOffset, setYoffset] = useState<number>(0);

    const [selectObject, setSelecObject] = useState<ICommunityData | IUserData | undefined>();

    const bodyRef = useRef(null);
    const componentRef = useRef(null);

    //Calculates the vertical offset based on the height of the tooltip, to center it around the focused object.
    useEffect(() => {
        const ref = bodyRef as any;
        const pRef = componentRef.current as any;

        if (ref.current !== null) {
            const parentPosition = getHTMLPosition(pRef.parentElement);
            setYoffset(ref.current.clientHeight / 2 + parentPosition.top);
        }

    }, [selectedObject?.position]);


    useEffect(() => {
        setSelecObject(selectedObject?.obj);

    }, [selectedObject?.obj, showLabel])

    useEffect(() => {
        setActive(isTooltipActive);
    }, [isTooltipActive])

    const tooltipTittle: React.ReactNode = getTooltipTittle(selectObject, translation);
    const tooltipBody: React.ReactNode[] = getTooltipBody(selectObject, showLabel, translation);

    if (selectedObject !== undefined && selectedObject.obj !== undefined && selectedObject.position !== undefined && isActive) {
        const style: React.CSSProperties = {}
        style.top = selectedObject.position.y - yOffset;
        style.left = selectedObject.position.x;

        return (
            <div
                ref={componentRef}
                style={style}
                className="tooltip-wrapper"
            >
                <div ref={bodyRef} className="tooltip-content">
                    <div className="row tooltip-header">
                        <h3 className="tooltip-tittle"> {tooltipTittle} </h3>
                        <Button
                            content=""
                            onClick={() => { setActive(false); }}
                            extraClassName="transparent btn-close"
                            postIcon={<div className="icon-close black" ></div>}
                        />
                    </div>
                    <div className="tooltip-body">
                        {tooltipBody}
                    </div>
                    <div className="tooltip-arrow" />
                </div >
            </div >
        );

    } else
        return <React.Fragment />;

}


/**
 * Gets the position of a HTML element in the DOM.
 * @param element element to get the position from.
 * @returns returns an object with the format { top: number, left: number, right: number, bottom: number}.
 */
export const getHTMLPosition = (element: HTMLDivElement) => {
    const cs = window.getComputedStyle(element);
    const marginTop = cs.getPropertyValue('margin-top');
    const marginLeft = cs.getPropertyValue('margin-left');

    const top = element.offsetTop - parseFloat(marginTop);
    const left = element.offsetLeft - parseFloat(marginLeft);

    return { top: top, left: left, right: left + element.offsetWidth, bottom: top + element.offsetHeight };
}


function getTooltipBody(selectedObject: ICommunityData | IUserData | undefined, showLabel: boolean, translation: ITranslation | undefined) {
    const body: React.ReactNode[] = []

    if (selectedObject !== undefined) {
        if (selectedObject?.users) {

            body.push(<div className="row" key={-1}> <strong> {translation?.dataColumn.communityNameLabel} </strong> &nbsp; {selectedObject.name} </div>);

        } else {

            if (showLabel) {
                body.push(<div className="row" key={-1}> <strong> {translation?.dataColumn.userLabelLabel} </strong> &nbsp; {selectedObject.label} </div>);
            }

            const keys = Object.keys(selectedObject.explicit_community);

            for (let i = 0; i < keys.length; i++) {
                body.push(<div className="row" key={i}> {`${keys[i]}: ${selectedObject.explicit_community[keys[i]]}`} </div>);
            }
        }
    }

    return body;
}

function getTooltipTittle(selectedObject: ICommunityData | IUserData | undefined, translation: ITranslation | undefined) {
    let tittle: React.ReactNode = "";

    if (selectedObject !== undefined)
        if (selectedObject?.users) {
            tittle = translation?.dataColumn.communityTittle;
        } else {
            tittle = translation?.dataColumn.citizenTittle;
        }

    return tittle;
}