/**
 * @fileoverview This file creates a table with 2 columns that contains the data from the rows shared as props.
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Packages
import React from "react";
//Local files
import '../style/Datatable.css';

/**
 * Aux class to streamline the data of each row. Key will be at the left of the row, value at the right
 */
export class DataRow {
    key: React.ReactNode;
    value: React.ReactNode;
    combineBoth: boolean;
    /**
     * Constructor of the class. There is no real distinction between the key param and the value param. 
     * Current datatable implementation shows key at the left of the row, and value at the right
     * @param key component of the row
     * @param value another component of the row
     */
    constructor(key: React.ReactNode, value: React.ReactNode, combineBoth: boolean = false) { this.key = key; this.value = value; this.combineBoth = combineBoth; }

    getKey(): React.ReactNode {
        if (!this.combineBoth) {
            return this.key;
        } else {
            return "";
        }
    }

    getValue(strongKey: boolean = false): React.ReactNode {
        if (!this.combineBoth) {
            return this.value;
        } else if (strongKey) {
            return (<div><strong> {this.key} </strong> {this.value}</div>)
        } else {
            return (<div>{this.key}{this.value}</div>)
        }

    }
}

interface DatatableProps {
    //Tittle of the datatable.
    tittle?: React.ReactNode;
    //Rows of the datatable that will be "stronger"
    MainRows: DataRow[];
    //Rows of the datatable
    SubRows: DataRow[];
}

/**
 * Basic UI component that show data in a table of 2 columns format
 */
export const DataTable = ({
    tittle = "Datatable",
    MainRows,
    SubRows,
}: DatatableProps) => {

    return (
        <div className="datatable">
            <h2> {tittle} </h2>
            <div className="datatable-content">
                {MainRows.map((item: DataRow, index: number): JSX.Element => {
                    return (
                        <div key={index} className="main-row row">
                            <strong> <React.Fragment >{item.getKey()}</React.Fragment> </strong>
                            {"\u00a0\u00a0"}
                            <React.Fragment >{item.getValue(true)}</React.Fragment>
                        </div>
                    );
                })}
                {SubRows.map((item: DataRow, index: number): JSX.Element => {
                    return (
                        <div key={index} className="sub-row row">
                            <React.Fragment >{item.getKey()}</React.Fragment>
                            {"\u00a0\u00a0"}
                            <React.Fragment >{item.getValue()}</React.Fragment>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};