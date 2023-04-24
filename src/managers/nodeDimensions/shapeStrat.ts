/**
 * @fileoverview This class changes the shape and font vertical align of users/nodes.
 * @author Marco Expósito Pérez
 */
//Constants
import { Dimensions, DimAttribute, nodeConst, shapeData } from "../../constants/nodes";
import { IUserData } from "../../constants/perspectivesTypes";
//Local files
import GenericStrategy from "./genericStrat";

export default class ShapeStrategy extends GenericStrategy {

    constructor(attributes: DimAttribute[]) {
        super(attributes, Dimensions.Shape, nodeConst.nodeDimensions.getShape);
    }

    /**
     * Changes the shape and font's vertical align
     * @param user user to edit
     */
    change(user: IUserData, isFocus: boolean, increasedSize: boolean) {
        if (this.attr !== undefined && this.attr.active) {

            if (user.isAnonGroup) {
                user["shape"] = nodeConst.defaultShape.name;
                user.font = {
                    vadjust: nodeConst.defaultShape.vAdjust,
                }
            } else if (user.isAnonymous) {
                user["shape"] = "image";
                user["image"] = nodeConst.defaultAnon;

            } else {
                const value = user.explicit_community[this.attr.key];

                const shape: shapeData = this.dimensionMap.get(value);

                if (shape !== undefined) {

                    user["shape"] = shape.name;

                    user.font = {
                        vadjust: shape.vAdjust,
                    }

                } else {
                    console.log("Shape value is undefined in shape Strategy change function when it should not be");
                }
            }

        } else {

            user["shape"] = nodeConst.defaultShape.name;
            user.font = {
                vadjust: nodeConst.defaultShape.vAdjust,
            }
        }

        if (isFocus && increasedSize) {
            user.size = nodeConst.selectedSize;
        } else if (user.isMedoid) {
            user.size = nodeConst.medoidSize;
        } else {
            user.size = nodeConst.defaultSize;
        }

        user.size = user.isAnonymous ? user.size + nodeConst.anonymousSizeIncrease : user.size;
    }

    /**
     * This strategy doesnt do anything when a node turn colorless
     * @param user 
     */
    toColorless(user: IUserData): void {
        user.size = user.isAnonymous ? nodeConst.defaultSize + nodeConst.anonymousSizeIncrease : nodeConst.defaultSize;

        if (user.isAnonymous && !user.isAnonGroup) {
            user["image"] = nodeConst.colorlessAnon;
        }
    }

    /**
     * Update this dimension attribute/values map with the new Dimension array
     * @param attributesArray 
     */
    update(attributesArray: DimAttribute[]) {
        this.attr = attributesArray.filter(attr => attr.dimension === Dimensions.Shape)[0];

        this.dimensionMap = new Map<string, string>();
        if (this.attr !== undefined) {
            this.fillMap(nodeConst.nodeDimensions.getShape);
        }
    }
}