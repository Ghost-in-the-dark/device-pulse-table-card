import{LitElement as g,html as o}from"https://unpkg.com/lit@3.1.2/index.js?module";import{when as m}from"https://unpkg.com/lit@3.1.2/directives/when.js?module";import{css as v}from"https://unpkg.com/lit@3.1.2/index.js?module";var _=v`
    :host {
        display: block;
        font-family: var(--paper-font-body1_-_font-family);
    }
    .card {
        background: var(--ha-card-background, var(--card-background-color));
        border-radius: var(--ha-card-border-radius, 12px);
    }
    .header {
        margin-bottom: 10px;
        margin-top: 24px;
        text-align: center;
    }
    .header h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin: 0;
    }
    .controls {
        padding: 0 8px 16px;
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
    }
    .filter-input {
        flex: 1;
        min-width: 200px;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
    }
    .filter-select {
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
    }

    .table-container {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        border-top: 1px solid var(--divider-color);
    }
    th {
        text-align: left;
        padding: 12px 8px;
        border-bottom: 3px solid var(--divider-color);
        user-select: none;
        white-space: nowrap;
        background: rgba(0, 0, 0, 0.03);
    }
    td {
        padding: 10px 8px;
        border-bottom: 1px solid var(--divider-color);
        white-space: nowrap;
    }
    table tr:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.015);
    }
    table tr:last-child td {
        border-bottom: none;
    }
    th.sortable:hover {
        cursor: pointer;
        border-bottom: 3px solid rgba(0, 0, 0, 0.3);
    }
    td.ping_status {
        min-width: 30px;
        text-align: center;
    }
    td.host {
        user-select: text;
    }
    .group-header {
        background: var(--secondary-background-color);
        font-weight: 500;
        padding: 8px;
        margin-top: 16px;
    }
    .group-header:first-child {
        margin-top: 0;
    }
    table.background-status .device-status-off {
        background-color: #db44371a;
    }
    table.background-status .device-status-on {
        background-color: #4caf501a;
    }
    table.background-status .device-status-warning {
        background-color: #f4a8361a;
    }
    .device_name {
        font-weight: bold;
    }
    .status-indicator {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }
    .status-on {
        background-color: var(--success-color);
        box-shadow: 0 0 6px var(--success-color);
    }
    .status-off {
        background-color: var(--error-color);
        box-shadow: 0 0 6px var(--error-color);
    }
    .status-warning {
        background-color: var(--warning-color);
        box-shadow: 0 0 6px var(--warning-color);
    }
    .no-data {
        padding: 20px;
        text-align: center;
        color: var(--secondary-text-color);
    }
    .clickable {
        cursor: pointer;
    }
    .clickable:hover {
        color: var(--primary-color);
    }
    .not-available {
        text-transform: uppercase;
        font-size: 13px;
        color: #777;
    }
    .total-failed-pings-count-number {
        color: var(--primary-text-color);
    }
    .total-failed-pings-count-started {
        color: var(--secondary-text-color);
        font-size: 12px;
        display: block;
    }
    @keyframes valueChangedAnimation {
        0% {
            transform: scale(1.2);
            font-weight: 700;
        }
        100% {
            transform: scale(1);
            font-weight: normal;
        }
    }
    td.value-changed span.animate-change {
        animation: valueChangedAnimation 2s ease-out;
        display: inline-block;
    }
`;var w="1.0.4",u=class extends g{static properties={_devices:{state:!0},_sortColumn:{type:String},_sortDirection:{type:String},_filterText:{type:String},_showStatus:{type:String},_groupBy:{type:String}};static styles=_;constructor(){super(),this._hass=null,this._initialized=!1,this._config={},this._devices={},this._unsubscribes=[],this._sortColumn="device_name",this._sortDirection="asc",this._filterText="",this._showStatus="all",this._groupBy="none",this._valueChangedCells=new Map,this._statusChangedRows=new Map}static getStubConfig(){return{title:"Monitored Network Devices",group_by_integration:!1,show_status:"all",columns:["host","integration_name"]}}static getConfigElement(){return document.createElement("device-pulse-table-card-editor")}set hass(t){this._hass||(this._hass=t,this._loadDevices(),this._subscribeToEvents())}setConfig(t){this._config={title:t.title||"Monitored Network Devices",...t,grid_options:{rows:t.grid_options?.rows??"auto",columns:t.grid_options?.columns??"auto",...t.grid_options}},this._config.group_by_integration&&(this._groupBy="integration_name"),this._showStatus=this._config.show_status}getCardSize(){return 4}disconnectedCallback(){this._unsubscribe?.length&&(this._unsubscribes.forEach(t=>t()),this._unsubscribes=[]),super.disconnectedCallback()}async _subscribeToEvents(){if(!(!this._hass?.connection||this._unsubscribes?.length))try{this._unsubscribes.push(await this._hass.connection.subscribeEvents(t=>this._handleStateChanged(t),"state_changed"))}catch(t){console.error("Unable to subscribe to events:",t)}}async _loadDevices(){try{let t=await this._hass.callWS({type:"device_pulse/get_devices"});t&&t.devices&&(this._initialized=!0,this._devices=t.devices)}catch(t){console.error("Unable to load Device Pulse monitored devices list:",t)}}_handleStateChanged(t){let e=t.data.entity_id,a=this._hass.entities[e];if(a&&a.platform==="device_pulse"){let s=a.device_id,n=t.data.new_state;if(!this._devices[s]){console.warn(`Device id [${s}] not found`);return}if(!n)return;if(this._valueChangedCells.has(s)||this._valueChangedCells.set(s,new Set),["ping_status","pings_failed_count","total_failed_pings_count","last_response_time"].includes(n.attributes.tag)){let i=n.attributes.tag;this._devices={...this._devices,[s]:{...this._devices[s],[i]:{...this._devices[s][i],state:n.state,...i==="ping_status"?{pings_failed:n.attributes.pings_failed}:{},...i==="total_failed_pings_count"?{count_started_at:n.attributes.count_started_at}:{}},...i==="ping_status"?{ping_status_since_timestamp:n.attributes.state_since}:{}}},i==="ping_status"&&(this._statusChangedRows.set(s,n.state),setTimeout(()=>{this._statusChangedRows.delete(s),this.requestUpdate()},2e3)),this._valueChangedCells.get(s).add(i),setTimeout(()=>{this._valueChangedCells.get(s)?.delete(i),this.requestUpdate()},2e3)}}}_handleSort(t){this._sortColumn===t?this._sortDirection=this._sortDirection==="asc"?"desc":"asc":(this._sortColumn=t,this._sortDirection="asc")}_handleFilter(t){this._filterText=t.target.value}_handleShowStatusChange(t){this._showStatus=t.target.value}_handleGroupChange(t){this._groupBy=t.target.value}_openEntityDialog(t){let e=new Event("hass-action",{bubbles:!0,composed:!0});e.detail={action:"tap",config:{entity:t,tap_action:{action:"more-info"}}},this.dispatchEvent(e)}_parseIpv4Address(t){let e=t.trim().split(".");if(e.length!==4)return null;let a=e.map(s=>{if(!/^\d+$/.test(s))return null;let n=Number(s);return n>=0&&n<=255?n:null});return a.includes(null)?null:a}_compareSortValues(t,e){let a=String(t??"").toLowerCase(),s=String(e??"").toLowerCase();if(this._sortColumn==="host"){let n=this._parseIpv4Address(a),i=this._parseIpv4Address(s);if(n&&i){for(let r=0;r<n.length;r++)if(n[r]!==i[r])return n[r]-i[r];return 0}}return a.localeCompare(s)}_getFilteredAndSortedDevices(){let t=Object.values(this._devices);if(this._filterText){let e=this._filterText.toLowerCase();t=t.filter(a=>a.device_name.toLowerCase().includes(e)||a.host.toLowerCase().includes(e)||a.integration_name.toLowerCase().includes(e))}return this._showStatus!=="all"&&(t=t.filter(e=>e.ping_status.state===this._showStatus)),t.sort((e,a)=>{let s=this._compareSortValues(e[this._sortColumn],a[this._sortColumn]);return this._sortDirection==="asc"?s:-s}),t}_groupDevices(t){if(this._groupBy==="none")return{"":t};let e={};return t.forEach(a=>{let s=a[this._groupBy]||"Unknown";e[s]||(e[s]=[]),e[s].push(a)}),e}_hasSort(t){return!["ping_status","last_response_time"].includes(t)}_getSortIcon(t){return this._sortColumn!==t?"":this._sortDirection==="asc"?"\u2191":"\u2193"}_getColumnLabel(t){return{device_name:"Name",host:"Host",integration_name:"Integration",ping_status:" ",ping_status_since_timestamp:"Since",pings_failed_count:"Pings Failed",total_failed_pings_count:"Total Failed Pings",last_response_time:"Last Response Time"}[t]||t}_renderCellValue(t,e){if(e==="device_name")return o`
                <span 
                    class="clickable"
                    @click=${()=>this._openEntityDialog(t.ping_status.entity_id)}
                >
                    ${t[e]}
                </span>
            `;if(e==="ping_status")return o`
                <span 
                  @click=${()=>this._openEntityDialog(t[e].entity_id)}
                  class="clickable status-indicator status-${t.ping_status.pings_failed&&t.ping_status.state==="on"?"warning":t.ping_status.state}"
                  title="${t.ping_status.state==="on"?"Connected":"Disconnected"}"
                ></span>
            `;if(e==="ping_status_since_timestamp"&&t[e]){let s=new Date-new Date(t[e]*1e3),n=Math.floor(s/1e3),i=Math.floor(n/60),r=Math.floor(i/60),l=Math.floor(r/24),c=[];l&&c.push(`${l}d`);let d=r%24;(l||d)&&c.push(`${d}h`);let p=i%60;(l||d||p)&&c.push(`${p}m`);let f=n%60;return c.push(`${f}s`),o`${c.join(" ")}`}if(e==="total_failed_pings_count"){if(!t[e])return o`<span class="not-available" title="Not Available">n.a.</span>`;let a=t[e].count_started_at;return o`
                <div class="clickable total-failed-pings-count" @click=${()=>this._openEntityDialog(t[e].entity_id)}>
                    <span class="total-failed-pings-count-number animate-change">
                        ${t[e].state&&!["unknown","unavailable"].includes(t[e].state)?t[e].state:"-"}
                    </span>
                    ${a?o`<span class="total-failed-pings-count-started">Since: ${new Date(a).toLocaleString()}</span>`:""}
                </div>
            `}return["pings_failed_count","last_response_time"].includes(e)?t[e]?o`<span class="clickable animate-change" @click=${()=>this._openEntityDialog(t[e].entity_id)}>
                    ${t[e].state&&!["unknown","0"].includes(t[e].state)?t[e].state:"-"} 
                    ${t[e].state&&t[e].state!=="unknown"?t[e].unit_of_measurement:""}
                </span>
            `:o`<span class="not-available" title="Not Available">n.a.</span>`:t[e]||"-"}_shouldShowColumn(t){return t==="device_name"?!0:t==="ping_status"?this._groupBy!=="ping_status":t==="integration_name"?this._groupBy!=="integration_name":this._config.columns.includes(t)}render(){let t=this._getFilteredAndSortedDevices(),e=this._groupDevices(t),a=["ping_status","device_name","host","ping_status_since_timestamp","last_response_time","pings_failed_count","total_failed_pings_count","integration_name"].filter(s=>this._shouldShowColumn(s));return o`
            <ha-card>
                <div class="card">
                    <div class="header">
                        <h2>${this._config?.title||"Monitored Network Devices"}</h2>
                    </div>
        
                    <div class="controls">
                        <input
                                type="text"
                                class="filter-input"
                                placeholder="Filter Devices ..."
                                .value=${this._filterText}
                                @input=${this._handleFilter}
                        />
                        <select class="status-select filter-select" @change=${this._handleShowStatusChange}>
                            <option value="all" ?selected=${this._showStatus==="all"}>
                                All Statuses
                            </option>
                            <option value="on" ?selected=${this._showStatus==="on"}>
                                Only Connected
                            </option>
                            <option value="off" ?selected=${this._showStatus==="off"}>
                                Only Disconnected
                            </option>
                        </select>
                        <select class="group-select filter-select" @change=${this._handleGroupChange}>
                            <option value="none" ?selected=${this._groupBy==="none"}>
                                No Group
                            </option>
                            <option value="integration_name" ?selected=${this._groupBy==="integration_name"}>
                                Group By Integration
                            </option>
                        </select>
                    </div>
        
                    <div class="table-container">
                        ${t.length===0?o` <div class="no-data">No Device Found</div>`:Object.entries(e).map(([s,n])=>o`
                                    ${this._groupBy!=="none"?o`
                                            <div class="group-header">
                                                ${s} (${n.length})
                                            </div>`:""}
                                    <table>
                                        <thead>
                                        <tr>
                                            ${a.map(i=>m(this._hasSort(i),()=>o`
                                                        <th class="sortable" @click=${()=>this._handleSort(i)}>
                                                            ${this._getColumnLabel(i)}
                                                            ${this._getSortIcon(i)}
                                                        </th>
                                                    `,()=>o`
                                                    <th>
                                                        ${this._getColumnLabel(i)}
                                                    </th>
                                                `))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        ${n.map(i=>o`
                                                <tr class="device-status-${i.ping_status.state} ${this._statusChangedRows.has(i.device_id)?"status-changed":""}">
                                                    ${a.map(r=>{let l=this._valueChangedCells.get(i.device_id)?.has(r)||this._valueChangedCells.get(i.device_id)?.size&&r==="ping_status";return o`
                                                                <td class="${r} ${l?"value-changed":""}">
                                                                    <span>${this._renderCellValue(i,r)}</span>
                                                                </td>`})}
                                                </tr>
                                            `)}
                                        </tbody>
                                    </table>
                                `)}
                    </div>
                </div>
            </ha-card>
        `}},h=class extends g{static properties={_config:{state:!0}};setConfig(t){this._config=t}_valueChanged(t){let e=t.target;if(!this._config||!e)return;let a={...this._config,...t.detail.value},s=new Event("config-changed",{bubbles:!0,composed:!0});s.detail={config:a},this.dispatchEvent(s)}_computeLabel(t){switch(t.name){case"title":return"Card Title";case"show_status":return"Statues to Show";case"group_by_integration":return"Group-By Integration";case"columns":return"Columns"}}render(){if(!this._config)return o``;let t=[{name:"title",selector:{text:{}}},{name:"show_status",selector:{select:{mode:"dropdown",options:[{value:"all",label:"All"},{value:"on",label:"Only Connected"},{value:"off",label:"Only Disconnected"}]}}},{name:"group_by_integration",selector:{boolean:{}}},{name:"columns",selector:{select:{multiple:!0,mode:"dropdown",options:[{value:"host",label:"Host"},{value:"integration_name",label:"Integration Name"},{value:"last_response_time",label:"Last Response Time"},{value:"pings_failed_count",label:"Pings Failed"},{value:"total_failed_pings_count",label:"Total Failed Pings"},{value:"ping_status_since_timestamp",label:"Connected/Disconnected Since"}]}}}];return o`
            <ha-form
                .hass=${this.hass}
                .data=${this._config}
                .schema=${t}
                .computeLabel=${this._computeLabel}
                @value-changed=${this._valueChanged}
            ></ha-form>
        `}};customElements.define("device-pulse-table-card",u);customElements.define("device-pulse-table-card-editor",h);window.customCards=window.customCards||[];window.customCards.push({type:"device-pulse-table-card",name:"Device Pulse Table",description:"Show a table of monitored network devices with Device Pulse integration",preview:!0,documentationURL:"https://github.com/studiobts/device-pulse-table-card"});console.info(`%c DEVICE-PULSE-TABLE-CARD %c v${w} `,"background: #1976d2; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","background: #ff7043; color: white; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;");
