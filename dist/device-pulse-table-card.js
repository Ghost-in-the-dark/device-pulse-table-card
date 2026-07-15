import{LitElement as _,html as o}from"https://unpkg.com/lit@3.1.2/index.js?module";import{when as g}from"https://unpkg.com/lit@3.1.2/directives/when.js?module";import{cardStyles as f}from"./device-pulse-table-card-style.js";const m="1.0.4";class v extends _{static properties={_devices:{state:!0},_sortColumn:{type:String},_sortDirection:{type:String},_filterText:{type:String},_showStatus:{type:String},_groupBy:{type:String}};static styles=f;constructor(){super(),this._hass=null,this._initialized=!1,this._config={},this._devices={},this._unsubscribes=[],this._sortColumn="device_name",this._sortDirection="asc",this._filterText="",this._showStatus="all",this._groupBy="none",this._valueChangedCells=new Map,this._statusChangedRows=new Map}static getStubConfig(){return{title:"Monitored Network Devices",group_by_integration:!1,show_status:"all",columns:["host","integration_name"]}}static getConfigElement(){return document.createElement("device-pulse-table-card-editor")}set hass(t){this._hass||(this._hass=t,this._loadDevices(),this._subscribeToEvents())}setConfig(t){this._config={title:t.title||"Monitored Network Devices",...t,grid_options:{rows:t.grid_options?.rows??"auto",columns:t.grid_options?.columns??"auto",...t.grid_options}},this._config.group_by_integration&&(this._groupBy="integration_name"),this._showStatus=this._config.show_status}getCardSize(){return 4}disconnectedCallback(){this._unsubscribe?.length&&(this._unsubscribes.forEach(t=>t()),this._unsubscribes=[]),super.disconnectedCallback()}async _subscribeToEvents(){if(!(!this._hass?.connection||this._unsubscribes?.length))try{this._unsubscribes.push(await this._hass.connection.subscribeEvents(t=>this._handleStateChanged(t),"state_changed"))}catch(t){console.error("Unable to subscribe to events:",t)}}async _loadDevices(){try{const t=await this._hass.callWS({type:"device_pulse/get_devices"});t&&t.devices&&(this._initialized=!0,this._devices=t.devices)}catch(t){console.error("Unable to load Device Pulse monitored devices list:",t)}}_handleStateChanged(t){const e=t.data.entity_id,n=this._hass.entities[e];if(n&&n.platform==="device_pulse"){let s=n.device_id,a=t.data.new_state;if(!this._devices[s]){console.warn(`Device id [${s}] not found`);return}if(!a)return;if(this._valueChangedCells.has(s)||this._valueChangedCells.set(s,new Set),["ping_status","pings_failed_count","last_response_time"].includes(a.attributes.tag)){let i=a.attributes.tag;this._devices={...this._devices,[s]:{...this._devices[s],[i]:{...this._devices[s][i],state:a.state,...i==="ping_status"?{pings_failed:a.attributes.pings_failed}:{}},...i==="ping_status"?{ping_status_since_timestamp:a.attributes.state_since}:{}}},i==="ping_status"&&(this._statusChangedRows.set(s,a.state),setTimeout(()=>{this._statusChangedRows.delete(s),this.requestUpdate()},2e3)),this._valueChangedCells.get(s).add(i),setTimeout(()=>{this._valueChangedCells.get(s)?.delete(i),this.requestUpdate()},2e3)}}}_handleSort(t){this._sortColumn===t?this._sortDirection=this._sortDirection==="asc"?"desc":"asc":(this._sortColumn=t,this._sortDirection="asc")}_handleFilter(t){this._filterText=t.target.value}_handleShowStatusChange(t){this._showStatus=t.target.value}_handleGroupChange(t){this._groupBy=t.target.value}_openEntityDialog(t){const e=new Event("hass-action",{bubbles:!0,composed:!0});e.detail={action:"tap",config:{entity:t,tap_action:{action:"more-info"}}},this.dispatchEvent(e)}_parseIpv4Address(t){const e=t.trim().split(".");if(e.length!==4)return null;const n=e.map(s=>{if(!/^\d+$/.test(s))return null;const a=Number(s);return a>=0&&a<=255?a:null});return n.includes(null)?null:n}_compareSortValues(t,e){const n=String(t??"").toLowerCase(),s=String(e??"").toLowerCase();if(this._sortColumn==="host"){const a=this._parseIpv4Address(n),i=this._parseIpv4Address(s);if(a&&i){for(let r=0;r<a.length;r++)if(a[r]!==i[r])return a[r]-i[r];return 0}}return n.localeCompare(s)}_getFilteredAndSortedDevices(){let t=Object.values(this._devices);if(this._filterText){const e=this._filterText.toLowerCase();t=t.filter(n=>n.device_name.toLowerCase().includes(e)||n.host.toLowerCase().includes(e)||n.integration_name.toLowerCase().includes(e))}return this._showStatus!=="all"&&(t=t.filter(e=>e.ping_status.state===this._showStatus)),t.sort((e,n)=>{const s=this._compareSortValues(e[this._sortColumn],n[this._sortColumn]);return this._sortDirection==="asc"?s:-s}),t}_groupDevices(t){if(this._groupBy==="none")return{"":t};const e={};return t.forEach(n=>{const s=n[this._groupBy]||"Unknown";e[s]||(e[s]=[]),e[s].push(n)}),e}_hasSort(t){return!["ping_status","last_response_time"].includes(t)}_getSortIcon(t){return this._sortColumn!==t?"":this._sortDirection==="asc"?"\u2191":"\u2193"}_getColumnLabel(t){return{device_name:"Name",host:"Host",integration_name:"Integration",ping_status:" ",ping_status_since_timestamp:"Since",pings_failed_count:"Pings Failed",last_response_time:"Last Response Time"}[t]||t}_renderCellValue(t,e){if(e==="device_name")return o`
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
            `;if(e==="ping_status_since_timestamp"&&t[e]){const s=new Date-new Date(t[e]*1e3),a=Math.floor(s/1e3),i=Math.floor(a/60),r=Math.floor(i/60),l=Math.floor(r/24);let u=[];l&&u.push(`${l}d`);const c=r%24;(l||c)&&u.push(`${c}h`);const h=i%60;(l||c||h)&&u.push(`${h}m`);const p=a%60;return u.push(`${p}s`),o`${u.join(" ")}`}return["pings_failed_count","last_response_time"].includes(e)?t[e]?o`<span class="clickable" @click=${()=>this._openEntityDialog(t[e].entity_id)}>
                    ${t[e].state&&!["unknown","0"].includes(t[e].state)?t[e].state:"-"} 
                    ${t[e].state&&t[e].state!=="unknown"?t[e].unit_of_measurement:""}
                </span>
            `:o`<span class="not-available" title="Not Available">n.a.</span>`:t[e]||"-"}_shouldShowColumn(t){return t==="device_name"?!0:t==="ping_status"?this._groupBy!=="ping_status":t==="integration_name"?this._groupBy!=="integration_name":this._config.columns.includes(t)}render(){const t=this._getFilteredAndSortedDevices(),e=this._groupDevices(t),n=["ping_status","device_name","host","ping_status_since_timestamp","last_response_time","pings_failed_count","integration_name"].filter(s=>this._shouldShowColumn(s));return o`
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
                        ${t.length===0?o` <div class="no-data">No Device Found</div>`:Object.entries(e).map(([s,a])=>o`
                                    ${this._groupBy!=="none"?o`
                                            <div class="group-header">
                                                ${s} (${a.length})
                                            </div>`:""}
                                    <table>
                                        <thead>
                                        <tr>
                                            ${n.map(i=>g(this._hasSort(i),()=>o`
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
                                        ${a.map(i=>o`
                                                <tr class="device-status-${i.ping_status.state} ${this._statusChangedRows.has(i.device_id)?"status-changed":""}">
                                                    ${n.map(r=>{const l=this._valueChangedCells.get(i.device_id)?.has(r)||this._valueChangedCells.get(i.device_id)?.size&&r==="ping_status";return o`
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
        `}}class b extends _{static properties={_config:{state:!0}};setConfig(t){this._config=t}_valueChanged(t){const e=t.target;if(!this._config||!e)return;let n={...this._config,...t.detail.value};const s=new Event("config-changed",{bubbles:!0,composed:!0});s.detail={config:n},this.dispatchEvent(s)}_computeLabel(t){switch(t.name){case"title":return"Card Title";case"show_status":return"Statues to Show";case"group_by_integration":return"Group-By Integration";case"columns":return"Columns"}}render(){if(!this._config)return o``;const t=[{name:"title",selector:{text:{}}},{name:"show_status",selector:{select:{mode:"dropdown",options:[{value:"all",label:"All"},{value:"on",label:"Only Connected"},{value:"off",label:"Only Disconnected"}]}}},{name:"group_by_integration",selector:{boolean:{}}},{name:"columns",selector:{select:{multiple:!0,mode:"dropdown",options:[{value:"host",label:"Host"},{value:"integration_name",label:"Integration Name"},{value:"last_response_time",label:"Last Response Time"},{value:"pings_failed_count",label:"Pings Failed"},{value:"ping_status_since_timestamp",label:"Connected/Disconnected Since"}]}}}];return o`
            <ha-form
                .hass=${this.hass}
                .data=${this._config}
                .schema=${t}
                .computeLabel=${this._computeLabel}
                @value-changed=${this._valueChanged}
            ></ha-form>
        `}}customElements.define("device-pulse-table-card",v),customElements.define("device-pulse-table-card-editor",b),window.customCards=window.customCards||[],window.customCards.push({type:"device-pulse-table-card",name:"Device Pulse Table",description:"Show a table of monitored network devices with Device Pulse integration",preview:!0,documentationURL:"https://github.com/studiobts/device-pulse-table-card"}),console.info(`%c DEVICE-PULSE-TABLE-CARD %c v${m} `,"background: #1976d2; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","background: #ff7043; color: white; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;");
