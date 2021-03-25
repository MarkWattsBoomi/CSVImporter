import React, { CSSProperties } from 'react';

import { eLoadingState, FlowComponent,  FlowOutcome,  FlowMessageBox, FlowObjectDataProperty, FlowObjectDataArray, FlowObjectData, FlowDisplayColumn, eContentType } from 'flow-component-model';
import FlowContextMenu from 'flow-component-model/lib/Dialogs/FlowContextMenu';

import './CSVImporter.css';

import Papa from 'papaparse';



//declare const manywho: IManywho;
declare const manywho: any;

export default class CSVImporter extends FlowComponent {
    version: string="1.0.0";
    context: any;
   
    contextMenu: FlowContextMenu;
    messageBox: FlowMessageBox;

    lastContent: any = (<div></div>);

    fileInput: any;

    filename: string = "Please select ... ";

    firstRowHeaders: boolean = false;
    flowTypeName: string = "";


    constructor(props: any) {
        super(props);
    
        this.flowMoved = this.flowMoved.bind(this);
        this.showContextMenu = this.showContextMenu.bind(this);
        this.hideContextMenu = this.hideContextMenu.bind(this);     

        this.pickFile = this.pickFile.bind(this);
        this.filePicked = this.filePicked.bind(this);

        this.firstRowHeaders = this.getAttribute("FirstRowHeaders","false").toLowerCase() === "true";
        this.flowTypeName = this.getAttribute("FlowTypeName","UNKNOWN");
    }
 
    async flowMoved(xhr: any, request: any) {
        let me: any = this;
        if(xhr.invokeType==="FORWARD") {
            if(this.loadingState !== eLoadingState.ready){
                window.setTimeout(function() {me.flowMoved(xhr, request)},500);
            }
            else {
                //do nothing
            }
        }
        
    }

    async componentDidMount() {
        //will get this from a component attribute
        await super.componentDidMount();
        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);

        this.forceUpdate();
    }

    
    async componentWillUnmount() {
        await super.componentWillUnmount();
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }


    //////////////////////////
    // constructs and shows context menu
    //////////////////////////
    showContextMenu(e: any) {
        e.preventDefault();
        e.stopPropagation();
        let listItems: Map<string , any> = new Map();
        if(this.contextMenu) {
            Object.keys(this.outcomes).forEach((key: string) => {
                const outcome: FlowOutcome = this.outcomes[key];
                if (outcome.isBulkAction === true && outcome.developerName !== "OnSelect" && outcome.developerName.toLowerCase().startsWith("cm")) {
                    listItems.set(outcome.developerName,(
                        <li 
                            className="sft-cm-item"
                            title={outcome.label || key}
                            onClick={(e: any) => {e.stopPropagation(); this.cmClick(key)}}
                        >
                            <span
                                className={"glyphicon glyphicon-" + (outcome.attributes["icon"]?.value || "plus") + " sft-cm-item-icon"} />
                            <span
                                className={"sft-cm-item-label"}
                            >
                                {outcome.label || key}
                            </span>
                        </li>
                    ));
                }
            });
            this.contextMenu.showContextMenu(e.clientX, e.clientY,listItems);   
            this.forceUpdate();
        }
    }

    async hideContextMenu() {
        this.contextMenu.hideContextMenu();
    }
    
    // a context menu item was clicked - the key will be the item's name
    cmClick(key: string) {
        this.doOutcome(key);
    }

    async doOutcome(outcomeName: string, selectedItem? : string) {
        if(this.outcomes[outcomeName]) {
            await this.triggerOutcome(outcomeName);
        }
        else {
            manywho.component.handleEvent(
                this,
                manywho.model.getComponent(
                    this.componentId,
                    this.flowKey,
                ),
                this.flowKey,
                null,
            );
        }
        this.forceUpdate();
    }  

    pickFile(e: any) {
        this.fileInput.value = '';
        this.fileInput.click();
    }

    async filePicked(e: any) {
        if (this.fileInput.files && this.fileInput.files.length === 1) {
            const file: File = this.fileInput.files[0];
            this.filename = file.name;
            let fileContent: string = await this.readCSVFile(file);
            const fname: string = file.name.lastIndexOf('.') >= 0 ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name;
            const ext: string = file.name.lastIndexOf('.') >= 0 ? file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase() : '';
            const typ: string = file.type;
            const size: number = file.size;

            const data = Papa.parse(fileContent);
            const newRows: FlowObjectDataArray = new FlowObjectDataArray();
            if(data.errors.length > 0) {
                alert(data.errors[0]);
            }
            else {
                let start: number = this.firstRowHeaders===true ? 1 : 0;
                for(let pos = start ; pos < data.data.length ; pos ++) {
                    newRows.addItem(this.makeObjectDataFromRow(data.data[pos] as string[]));
                }
            }
            await this.setStateValue(newRows);

            if(this.outcomes["OnSelect"]) {
                await this.triggerOutcome("OnSelect");
            }
            this.forceUpdate();
        }
    }

    // we get given an array of column values
    makeObjectDataFromRow(row: string[]) : FlowObjectData {
        let result: FlowObjectData = FlowObjectData.newInstance(this.flowTypeName);
        this.model.displayColumns.forEach((col: FlowDisplayColumn) => {
            let val: string = "";
                switch(col.contentType) {
                    case eContentType.ContentDateTime:
                        let dt: Date;
                        try {
                            dt = new Date(row[col.displayOrder]);
                        }
                        catch (e) {
                            dt = undefined;
                        }
                        if((dt instanceof Date && !isNaN(dt.getTime())) === true) {
                            val=dt.toISOString();
                        }
                        break;
                    default:
                        val=row[col.displayOrder];

                }
            result.addProperty(
                
                FlowObjectDataProperty.newInstance(
                    col.developerName, col.contentType,val
                )
            );
        })

        return result;
    }

    async readCSVFile(file: any): Promise<any> {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException('Problem reading file'));
            };
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsText(file);
        });
    }

    render() {
        
        if(this.loadingState !== eLoadingState.ready) {
            return this.lastContent;
        }
        
        
        

        //handle classes attribute and hidden and size
        let classes: string = "csv " + this.getAttribute("classes","");
        let style: CSSProperties = {};
        style.width = "-webkit-fill-available";
        style.height = "-webkit-fit-content";

        if(this.model.visible === false) {
            style.display = "none";
        }
        if(this.model.width) {
            style.width=this.model.width + "px"
        }
        if(this.model.height) {
            style.height=this.model.height + "px"
        }
             
        let title:  string = this.model.label || "";
        
        this.lastContent = (
            <div
                className={classes}
                style={style}
                onContextMenu={this.showContextMenu}
            >
                <FlowMessageBox
                    parent={this}
                    ref={(element: FlowMessageBox) => {this.messageBox = element}}
                />
                <FlowContextMenu
                    parent={this}
                    ref={(element: FlowContextMenu) => {this.contextMenu = element}}
                />
                <input 
                    type="file"
                    style={{display: "none"}}
                    ref={(element: any) => {this.fileInput = element}}
                    onChange={this.filePicked}
                />
                <div
                    className="csv-content"
                >
                    <div
                        className="csv-title"
                    >
                        <span
                            className="csv-title-text"
                        >
                            {title}
                        </span>
                        
                    </div>
                    <div
                        className="csv-filename"
                        onClick={this.pickFile}
                    >
                        <span
                            className="csv-filename-text"
                            title="Click to select a file"
                        >
                            {this.filename}
                        </span>
                        
                    </div>
                </div>
            </div>
        );
        return this.lastContent;
    }

}

manywho.component.register('CSVImporter', CSVImporter);