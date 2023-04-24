/**
 * @fileoverview This class changes the background color of users/nodes.
 * @author Marco Expósito Pérez
 */
//Constants
import { Dimensions, DimAttribute, nodeConst } from "../../constants/nodes";
import { IUserData } from "../../constants/perspectivesTypes";
//Local files
import GenericStrategy from "./genericStrat";

export default class ColorStrategy extends GenericStrategy {

    constructor(attributes: DimAttribute[]) {
        super(attributes, Dimensions.Color, nodeConst.nodeDimensions.getColor);
    }

    /**
     * Changes the background's color
     * @param user user to edit
     */
    change(user: IUserData, isFocus: Boolean, increasedSize: boolean) {
        if (this.attr !== undefined && this.attr.active && !user.isAnonymous && !user.isAnonGroup) {

            const value = user.explicit_community[this.attr.key];

            user["color"] = {
                background: this.dimensionMap.get(value),
            }

        } else {
            if (user.isAnonGroup) {
                user["color"] = {
                    background: "black",
                }
            } else {
                user["color"] = {
                    background: nodeConst.defaultColor,
                }
            }

        }
    }

    /**
     * Change the background's color
     * @param user user to edit
     */
    toColorless(user: IUserData) {
        if (!user.isAnonymous) {
            if (user["color"] === undefined) {
                user["color"] = {
                    background: nodeConst.noFocusColor.background,
                }
            } else {
                user.color.background = nodeConst.noFocusColor.background;
            }
        }
        if (user.isAnonGroup) {
            user.color.background = nodeConst.noFocusColor.background;
        }

    }

    /**
     * Update this dimension attribute/values map with the new Dimension array
     * @param attributesArray 
     */
    update(attributesArray: DimAttribute[]) {
        this.attr = attributesArray.filter(attr => attr.dimension === Dimensions.Color)[0];

        this.dimensionMap = new Map<string, string>();
        if (this.attr !== undefined) {
            this.fillMap(nodeConst.nodeDimensions.getColor);
        }
    }

}