// @flow

{let e,t,r,o,n,l,s,f,i,h,w,a,d,u,_,c,S,g,y,b,m,v,j,x,O,V;s=Object.getPrototypeOf,i={},h=s(f={isConnected:1}),w=s(s),a=(e,t,r,o)=>(e??(setTimeout(r,o),new Set)).add(t),d=(e,t,o)=>{let n=r;r=t;try{return e(o)}catch(e){return console.error(e),o}finally{r=n}},u=e=>e.filter(e=>e.t?.isConnected),_=e=>n=a(n,e,()=>{for(let e of n)e.o=u(e.o),e.l=u(e.l);n=l},1e3),c={get val(){return r?.i?.add(this),this.rawVal},get oldVal(){return r?.i?.add(this),this.h},set val(o){r?.u?.add(this),o!==this.rawVal&&(this.rawVal=o,this.o.length+this.l.length?(t?.add(this),e=a(e,this,O)):this.h=o)}},S=e=>({__proto__:c,rawVal:e,h:e,o:[],l:[]}),g=(e,t)=>{let r={i:new Set,u:new Set},n={f:e},l=o;o=[];let s=d(e,r,t);s=(s??document).nodeType?s:new Text(s);for(let e of r.i)r.u.has(e)||(_(e),e.o.push(n));for(let e of o)e.t=s;return o=l,n.t=s},y=(e,t=S(),r)=>{let n={i:new Set,u:new Set},l={f:e,s:t};l.t=r??o?.push(l)??f,t.val=d(e,n,t.rawVal);for(let e of n.i)n.u.has(e)||(_(e),e.l.push(l));return t},b=(e,...t)=>{for(let r of t.flat(1/0)){let t=s(r??0),o=t===c?g(()=>r.val):t===w?g(r):r;o!=l&&e.append(o)}return e},m=(e,t,...r)=>{let[o,...n]=s(r[0]??0)===h?r:[{},...r],f=e?document.createElementNS(e,t):document.createElement(t);for(let[e,r]of Object.entries(o)){let o=t=>t?Object.getOwnPropertyDescriptor(t,e)??o(s(t)):l,n=t+","+e,h=i[n]??(i[n]=o(s(f))?.set??0),a=e.startsWith("on")?(t,r)=>{let o=e.slice(2);f.removeEventListener(o,r),f.addEventListener(o,t)}:h?h.bind(f):f.setAttribute.bind(f,e),d=s(r??0);e.startsWith("on")||d===w&&(r=y(r),d=c),d===c?g(()=>(a(r.val,r.h),f)):a(r)}return b(f,...n)},v=e=>({get:(t,r)=>m.bind(l,e,r)}),j=new Proxy(e=>new Proxy(m,v(e)),v()),x=(e,t)=>t?t!==e&&e.replaceWith(t):e.remove(),O=()=>{let r=0,o=[...e].filter(e=>e.rawVal!==e.h);do{t=new Set;for(let e of new Set(o.flatMap(e=>e.l=u(e.l))))y(e.f,e.s,e.t),e.t=l}while(++r<100&&(o=[...t]).length);let n=[...e].filter(e=>e.rawVal!==e.h);e=l;for(let e of new Set(n.flatMap(e=>e.o=u(e.o))))x(e.t,g(e.f,e.t)),e.t=l;for(let e of n)e.h=e.rawVal},V={add:b,tags:j,state:S,derive:y,hydrate:(e,t)=>x(e,g(t,e))},window.van=V;}
const {span, input, id} = van.tags;
//      
const TITLE = document.querySelector("title").text;
var path = window.location.pathname; // 현재 URL의 경로를 가져옵니다.
const FILENAME = path.substring(path.lastIndexOf('/') + 1); // 경로에서 파일 이름을 추출합니다.

// 메인스레드와 웹 워커 간의 통신채널
var channel1 = new MessageChannel(); 
var channel2 = new MessageChannel(); // main.js(STACK_INIT) --> data.js <--> imp.js
var channel3 = new MessageChannel(); // main.js(Calendex Change : MONTHLY_LIST | DAILY_LIST | TIMELY_LIST) <--> data.js

// >>> 241021 hjkim - 한/영문 타이틀시 커버
const is_title = (_t) => {
    switch (_t) {
        case "대시보드":
            if(TITLE.includes(_t)) return true;
            if(TITLE.includes("Dashboard")) return true;
            break;
        case "BOP진단":
            if(TITLE.includes(_t)) return true;
            if(TITLE.includes("BOP Diagnosis")) return true;
            break;
        case "스택진단":
            if(TITLE.includes(_t)) return true;
            if(TITLE.includes("Stack Diagnosis")) return true;
            break;
        case "AI 학습":
            if(TITLE.includes(_t)) return true;
            if(TITLE.includes("AI Training")) return true;
            break;
        default:
            return false;
            break;
    }
}
// <<< 241021 hjkim - 영문 타이틀시 커버
                   
var g_graph_data               ;
var SW_SENSOR_RAW_REUSE = false;
var g_page_state = 0;
var g_ma_list;
const DATA_LEGEND_HIGHLIGHTED = "data_legend_highlighted";
const CALENDEX_COOKIE_EXPIRE = 30;
// >>> 240105 hjkim - SW센서 / BOP 진단결과
var g_is_sw_sensor_graph = false;
var g_FlotOption = {
    init_line_opt: null,
};
const g_sw_sensor_graph_h = 200;
// >>> 240105 hjkim - SW센서 / BOP 진단결과

var g_el = {
    graph: document.querySelector("#graph"),
    subgraph: document.querySelector("#subgraph"),
    graph_main: document.querySelector(".graph_main"),
    graph_controller: document.querySelector(".graph_controller"),
    custom_legend: document.querySelector("#custom_legend"),
    legend_btn: document.querySelector("#legend_btn"),
    recovery_btn: document.querySelector("#recovery_btn"),
    data_url: document.querySelector("#data_url"),
    event_url: document.querySelector("#event_url"),
    sel_data_url: document.querySelector("#sel_data_url"),
    sel_label_group: document.querySelector("#sel_scoped_label"),
    auto_reload: document.querySelector("#auto_reload"),
    yearly: document.querySelector("#yearly"),
    monthly: document.querySelector("#monthly"),
    daily: document.querySelector("#daily"),
    timely: document.querySelector("#timely"),
    // >>> 240105 hjkim - SW센서 / BOP 진단결과
    result_diagnosis: document.querySelector(".result .bop .graph .outline"),
    stack_event: document.querySelector(".result .stack .graph .outline"),
    barcode_graph: document.querySelectorAll(".result * .graph"),
    // >>> 240105 hjkim - SW센서 / BOP 진단결과
};

var g_graph_inst, g_graph_soft;
const DATA_LEGEND_CHECKED = "data_legend_checked";
const DATA_LEGEND_LABEL = "data_legend_label";
const STACK_NAME_SELECTOR = "#fuelcell-select";
let savedZoomRange = null;

// >>> 240306 hjkim - calendex refactoring
var g_yearly_list = [2023, 2024];
// >>> 240823 hjkim - 스택변경 이벤트 핸들러
var STACK_NAME = () => ( (new URLSearchParams(location.search)).get('fuelcell') || "F001");
// {
//     var stack_el = document.querySelector(STACK_NAME_SELECTOR);
//     if(stack_el == null) { return "F002"; }
//     // else if(stack_el.value == "1") return "F001";
//     // else if(stack_el.value == "2") return "F002";
//     return stack_el.value;
// }
// <<< 240823 hjkim - 스택변경 이벤트 핸들러
// var BASE_DATA_URI = "/ALL/data/";
const BASE_DATA_URI = () => `/data/${PLANT_FOLDER()}/${STACK_NAME()}/BOP/`;
//const BASE_DATA_URI = "../../../../var/H2/Daejeon/Raw";
// <<< 240306 hjkim - calendex refactoring

// >>> 241120 hjkim - plant 정보를 가져오기
const PLANT_FOLDER = () => ( (new URLSearchParams(location.search)).get('plant') || "SE01");
// <<< 241120 hjkim - plant 정보를 가져오기

// >>> 241128 hjkim - 스택 엘리먼트 동기화
const GET_ASYNC_STACK_EL = (callback) => {
    retry(`document.querySelector("${STACK_NAME_SELECTOR}") != null`, 10, 10, 
        () => { console.log("GET_ASYNC_STACK_EL retry!!");
            return callback(document.querySelector(STACK_NAME_SELECTOR));
        }
    );
}
// <<< 241128 hjkim - 스택 엘리먼트 동기화

var TimeSeriesPlot = {};

(function(Interface) { // Variable Scope Isolation
    // >>> 231128 hjkim - main.js argument 수용
    // <script src="js/main.js?type=1&graph=#graph&yearly=#yearly&monthly=#monthly&daily=#daily&legend=#custom_legend"></script>
    /* Argument 
    * - type=1|2           : { HW 센서 | SW 센서 }
    * - graph="#graph"     : 그래프 <div> id
    * - yearly="#yearly"   : 년간 <select> id
    * - monthly="#monthly" : 월간 <select> id
    * - daily="#daily"     : 일간 <select> id
    * - timely="#timely"   : 시간 <select> id
    */
    
    // >>> 231215 hjkim - main.js bode플롯 수용
    // <script src="js/main.js?type=3&graph=.widget.stack-status>.widget-body>.row>.left-side>div"></script>
    // <script src="js/main.js?type=4&graph=.widget.stack-status>.widget-body>.row>.right-side>div"></script>
    /* Argument
    * - type=3|4             : { Nyquist | Bode 플롯 }
    * - graph="#graph"       : 그래프 <div> id
    */
    
    function get_qs_from_src() {
        var srcEl = document.currentScript;
        if(srcEl != null) return srcEl.src.split('?')[1]; 
        else return "";
    }
    
    function get_argv_from_qs(qs) {
        var kv_arr = qs.split("&");
        if (kv_arr.length == 0) { return {}; }
        var r = {};
        for (var i = 0; i < kv_arr.length; ++i) {
            var kv = kv_arr[i].split("=", 2);
            if(kv.length == 1 || kv[0] == null || kv[0] == "") { console.error("잘못된 QueryString 입니다."); }
            else r[kv[0]] = decodeURIComponent(kv[1].replace(/\+/g, " "));
        }
        return r;
    }
    // <<< 231128 hjkim - main.js argument 수용
    
    function _replaceAll(given_str, niddle, new_str) {
        return given_str.replace(new RegExp(__escapeRegExp(niddle), 'g'), new_str);
        function __escapeRegExp(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }
    }
    
    // >>> 231128 hjkim - main.js argument 수용
    function init_accept_argument(_argv) {
        for(var i = 0, key_arr = Object.keys(_argv); i < key_arr.length; i++) {
            var k = key_arr[i], v = _argv[k];
            var _el            ;
            switch(k) {
                case "type":
                // TODO: 1: HW 그래프
                // TODO: 2: SW 그래프
                break;
                case "graph":
                _el = g_el.graph = document.querySelector(v);
                // 파라미터 에러 체크
                if(_el == null) { console.error(`${k} 파라미터 에러!`); }
                if(_el.tagName != "DIV") { console.error(`${k}가 DIV 태그가 아님!`); }
                break;
                case "yearly":
                case "monthly":
                case "daily":
                if(false) null;
                else if(k == "yearly")  _el = g_el.yearly = document.querySelector(v);
                else if(k == "monthly") _el = g_el.monthly = document.querySelector(v);
                else if(k == "daily")   _el = g_el.daily = document.querySelector(v);
                else if(k == "timely")  _el = g_el.timely = document.querySelector(v);
                // 파라미터 에러 체크
                if(_el == null) { console.error(`${k} 파라미터 에러!`); }
                if(_el.tagName != "SELECT") { console.error(`${k}가 SELECT 태그가 아님!`); }
                break;
                case "legend":
                _el = g_el.custom_legend = document.querySelector(v);
                // 파라미터 에러 체크
                if(_el == null) { console.error(`${k} 파라미터 에러!`); }
                if(_el.tagName != "DIV") { console.error(`${k}가 DIV 태그가 아님!`); }
                break;
            }
        }
    }
    // <<< 231128 hjkim - main.js argument 수용
    
    // >>> 231201 hjkim - 라이브러리 로딩
    var fn_load_js = function(src_url, cb_init) {	
        var my_head = document.getElementsByTagName('head')[0];
        var my_js = document.createElement('script');
        my_js.type= 'text/javascript';
        my_js.async = true;
        my_js.src = src_url;
        if(cb_init !== null) my_js.onload = function (){if(typeof cb_init == "function"){cb_init();} };
        my_head.appendChild(my_js);
    }
    
    let fn_change_yearly_listener = function(e) { 
        Calendex.refresh_monthly(e, function (last_item) {
            if (Calendex._fn_init_graph) { 
                if(g_el.monthly == null) throw "monthly 요소가 없습니다.";
                g_el.monthly.value = last_item; 
                Calendex.refresh_daily({}, fn_refresh_timely_cb); 
            }
        }, Calendex.refresh_monthly, Calendex._fn_init_graph);
        
        function fn_refresh_timely_cb(last_item) {
            if(g_el.daily == null) { throw "daily 요소가 없습니다."; }
            g_el.daily.value = last_item;
            // 시 선택 갱신
            Calendex.refresh_timely({}, function (last_item) {
                
                // CSV / JPG 분류
                if(g_el.timely == null) { throw "timely 요소가 없습니다."; }
                g_el.timely.value = last_item;
                if(g_el.yearly == null) { throw "yearly 요소가 없습니다."; }
                if(g_el.monthly == null) { throw "monthly 요소가 없습니다."; }
                if(g_el.daily == null) { throw "daily 요소가 없습니다."; }
                window.g_data_url = `${BASE_DATA_URI()}/${g_el.yearly.value}/${g_el.monthly.value}${g_el.daily.value}${g_el.timely.value}`;
                
                if (g_graph_inst) { TimeSeriesPlot.reload_graph({ target: g_el.timely }); } /* 그래프가 있으면 그래프 갱신 */
                else {
                    if(fn_init_graph == null) throw "콜백함수가 없습니다.";
                    fn_init_graph(); /* 그래프가 없으면 그래프 초기화 함수 콜백 */
                }
            }, 
            Calendex.refresh_daily, /* 퇴각검색을 위한 콜백함수 */
            arguments.callee /* 퇴각검색을 위한 콜백파라미터 */);
        }
    };
    
    let fn_change_monthly_listener = function (e) {
        Calendex.refresh_daily(e, (last_item) => {
            Calendex.refresh_timely(e, (last_item) => {
                TimeSeriesPlot.reload_graph(e); 
            });
        }); 
    };
    
    let fn_change_daily_listener = function (e) {
        Calendex.refresh_timely(e, (last_item) => {
            TimeSeriesPlot.reload_graph(e); 
        }); 
    };
    
    let fn_change_timely_listener = function (e) { 
        TimeSeriesPlot.reload_graph(e); 
    };
    
    // >>> 240119 hjkim - 아파치 서버 포팅 작업
    function init_page(_num ) {
        var _h = 0;
        var _sync_flag;
        var component_h;
        var COMPONENT_SELECTOR;
        switch(_num) {
            case 1:
            var argv_qs = get_qs_from_src();
            var argv = get_argv_from_qs(argv_qs);
            // >>>>>> !!!순서가 중요
            init_accept_argument(argv);
            // STEP 1.
            // >>> 240105 hjkim - 미디어 쿼리 대신 그래프 세로 길이 조정
            COMPONENT_SELECTOR = ".widget.BOP-graph";
            component_h = document.querySelector(COMPONENT_SELECTOR);
            _h = component_h.clientHeight - 55;
            // <<< 240105 hjkim - 미디어 쿼리 대신 그래프 세로 길이 조정
            // STEP 2.
            // >>> 240105 hjkim - 그래프 Placeholder 생성
            g_el.graph.parentElement.innerHTML = `<div id="graph" style="width:100%; height:${_h}px;">`;
            // <<< 240105 hjkim - 그래프 Placeholder 생성
            // STEP 3.
            // <<<<<< !!!순서가 중요
            _sync_flag = {cnt : 0, max : 5 };
            fn_load_js(location.origin+"/NEW/flot/color_palette.js", () => {
                fn_load_js(location.origin+"/NEW/flot/jquery-3.2.1.js", () => {
                    fn_load_js(location.origin+"/NEW/flot/jquery.flot.js", () => {
                        fn_load_js(location.origin+"/NEW/flot/jquery.flot.time.js",             () => { all_done(_sync_flag); } );
                        fn_load_js(location.origin+"/NEW/flot/jquery.flot.tooltip.js",          () => { all_done(_sync_flag); } );
                        fn_load_js(location.origin+"/NEW/flot/jquery.flot.crosshair.js",        () => { all_done(_sync_flag); } );
                        fn_load_js(location.origin+"/NEW/flot/jquery.flot.selection.drag.js",   () => { all_done(_sync_flag); } );
                        fn_load_js(location.origin+"/NEW/flot/jquery.flot.resize.js",           () => { all_done(_sync_flag); } );
                    });
                });
            });
            break;
            case 2:
            break;
            case 3:
            // >>> 231228 hjkim - BOP 진단에 그래프 추가
            var argv_qs = get_qs_from_src();
            var argv = get_argv_from_qs(argv_qs);
            // >>>>>> !!!순서가 중요
            // STEP 1.
            // >>> 240105 hjkim - 미디어 쿼리 대신 그래프 세로 길이 조정
            COMPONENT_SELECTOR = ".widget.HW-bop-senser-monitoring";
            component_h = document.querySelector(COMPONENT_SELECTOR);
            _h = component_h.clientHeight - 55;
            // <<< 240105 hjkim - 미디어 쿼리 대신 그래프 세로 길이 조정
            // STEP 2.
            // >>> 240105 hjkim - 그래프 Placeholder 생성
            var _placeholder = document.querySelector(".widget.HW-bop-senser-monitoring .widget-body");
            var _graph_el = document.createElement("div");
            _graph_el.id = "graph";
            // _graph_el.style = `height: ${_h}px`;
            _graph_el.style.height = `${_h}px`;
            if(_placeholder == null) { console.error("_placeholder가 없습니다."); return; }
            _placeholder.appendChild(_graph_el);
            // <<< 240105 hjkim - 그래프 Placeholder 생성
            // STEP 3.
            argv["graph"] = ".widget.HW-bop-senser-monitoring .widget-body #graph";
            init_accept_argument(argv);
            // <<<<<< !!!순서가 중요
            
            // >>> 240105 hjkim - SW센서 / BOP 진단결과
            g_is_sw_sensor_graph = true;
            // <<< 240105 hjkim - SW센서 / BOP 진단결과
            
            _sync_flag = {cnt: 0, max: 5};
            fn_load_js(location.origin+"/NEW/flot/color_palette.js", () => {
                fn_load_js(location.origin+"/NEW/flot/jquery-3.2.1.js", () => {
                    fn_load_js(location.origin+"/NEW/flot/jquery.flot.js", () => {
                        fn_load_js(location.origin+"/NEW/flot/jquery.flot.time.js",             () => all_done(_sync_flag) );
                        fn_load_js(location.origin+"/NEW/flot/jquery.flot.tooltip.js",          () => all_done(_sync_flag) );
                        fn_load_js(location.origin+"/NEW/flot/jquery.flot.crosshair.js",        () => all_done(_sync_flag) );
                        fn_load_js(location.origin+"/NEW/flot/jquery.flot.selection.drag.js",   () => all_done(_sync_flag) );
                        fn_load_js(location.origin+"/NEW/flot/jquery.flot.resize.js",           () => all_done(_sync_flag) );
                    });
                });
            });
            // <<< 231228 hjkim - BOP 진단에 그래프 추가
            break;
            default:
            console.error("Fail to init_page().");
            break;
        }
    }
    // 페이지 초기화
    if(is_title("대시보드")) {
        init_page(1);
        g_page_state = 1;
    }
    if(is_title("BOP진단")) {
        init_page(3);
        g_page_state = 3;
    }
    switch(location.pathname) {
        case "/NEW":
        case "/NEW/":
        case "/NEW/index.html":
        init_page(2);
        g_page_state = 2;
        break;
    }
    // >>> 240119 hjkim - 아파치 서버 포팅 작업
    function renew_element_after_innerHTML(_selector) { return document.querySelector(_selector); }
    
    function all_done(_sync_flag) { 
        var CALENDEX_COOKIE_EXPIRE = 30;
        if(++_sync_flag.cnt === _sync_flag.max) {
            // >>> 엘리먼트 초기화
            g_el.graph = renew_element_after_innerHTML("#graph");
            Calendex.init_el(g_el.graph);
            g_el.graph = renew_element_after_innerHTML("#graph");
            // <<< 엘리먼트 초기화
            
            // >>> 캘린덱스 초기화 
            if(is_title("대시보드")) {
                // >>> 240826 hjkim - 경로변경
                init_dashboard_onload();
                // <<< 240826 hjkim - 경로변경
                Calendex.enroll_callback(function () {
                    // var _retry_cnt = 0;
                    // var _retry: IntervalID = setInterval(() => {
                    //     if(_retry_cnt++ > 100) clearInterval(_retry);
                    //     if(window.g_data_url == null) return;
                    //     get_data(window.g_data_url, g_event_url); 
                    //     clearInterval(_retry);
                    // }, 100);
                    // >>> 240823 hjkim - 대시보드 첫 진입시 Soft센서 데이터가 그래프에 표시되는 버그
                    // get_data(g_data_url, g_event_url);
                    channel1.port2.postMessage({
                        msg: "CH1/(4)BOP_DATA_FETCH", 
                        url: g_data_url, 
                        imp_url: "/ALL/data/impedance/imp_data/",
                        window_size: -1,
                        is_result: true,
                        debug: "L426"
                    });
                    // <<< 240823 hjkim - 대시보드 첫 진입시 Soft센서 데이터가 그래프에 표시되는 버그
                });
            }
            // >>> 240826 hjkim - 
            if(is_title("BOP진단")) {
                init_bop_onload();
                Calendex.enroll_callback(() => {});
            }
            // <<< 240826 hjkim - 
            // <<< 캘린덱스 초기화
            // fn_onload();
        }
    }
    // <<< 231201 hjkim - 라이브러리 로딩
    function legend_show(e) {
        // console.log(g_el.legend_btn.innerText);
        if(g_el.legend_btn == null) { console.error("legend_btn 가 없습니다."); return; }
        if (g_el.legend_btn.innerText == "범례숨김") {
            g_el.legend_btn.innerText = "범례보임";
        } else {
            g_el.legend_btn.innerText = "범례숨김";
        }
        if(g_el.custom_legend == null) { console.error("custom_legend 가 없습니다."); return; }
        if (g_el.custom_legend.style.visibility == "") {
            g_el.custom_legend.setAttribute("style", "visibility: hidden;");
            //
            if(g_el.graph_main == null) { console.error("graph_main 가 없습니다."); return; }
            g_el.graph_main.className += " expand";
            if(g_el.graph_controller == null) { console.error("graph_controller가 없습니다."); return; }
            g_el.graph_controller.className += " shrink";
        } else {
            if(g_el.custom_legend == null) { console.error("custom_legend 가 없습니다."); return; }
            g_el.custom_legend.setAttribute("style", "");

            if(g_el.graph_main == null) { console.error("graph_main 이 없습니다."); return; }
            g_el.graph_main.className = _replaceAll(g_el.graph_main.className, " expand", "");
            
            if(g_el.graph_controller == null) console.error("graph_controller 가 없습니다.");
            else g_el.graph_controller.className = _replaceAll(g_el.graph_controller.className, " shrink", "");
        }
    }
    
    function make_legend(col, label_data) {
        var placeholder = g_el.custom_legend;
        if(placeholder == null) { console.error("custom_legend가 없습니다."); return; }
        
        // TABLE INIT
        var table_el = document.createElement("table");
        for (var k = 0; k < label_data.length;) {
            var tr_el = document.createElement("tr");
            for (var j = 0; j < col; j++) {
                var td_el_color = document.createElement("td");
                var td_el_text = document.createElement("td");
                if (k == 0 && j == 0) {
                    // INIT SELECTED LEGEND
                    var color_box_el = document.createElement("div");
                    // color_box_el.style = "width:0px; height:0; border:10px solid white; overflow:hidden";
                    color_box_el.setAttribute("style", "width:0px; height:0; border:10px solid white; overflow:hidden");
                    td_el_color.id = "selected_legend";
                    td_el_color.append(color_box_el);
                    toggle_color_box(color_box_el);
                    toggle_color_box(color_box_el);
                    // INIT CLEAR LEGEND
                    td_el_text.id = "clear_legend";
                    td_el_text.innerText = "클리어";
                    // td_el_text.style = "text-decoration: underline; cursor:pointer";
                    td_el_text.setAttribute("style", "text-decoration: underline; cursor:pointer");
                    td_el_text.setAttribute("toggle", "on");
                    tr_el.append(td_el_color, td_el_text);
                    continue;
                }
                td_el_color.setAttribute("class", "legend_color");
                td_el_text.setAttribute("class", "legend_text");
                try {
                    if (label_data[k].label != undefined) {
                        // COLOR
                        if (label_data[k].color != undefined) {
                            color_box_el = document.createElement("div");
                            // color_box_el.style = "width:0px;height:0;border:10px solid " + label_data[k].color + ";overflow:hidden";
                            color_box_el.setAttribute("style", "width:0px;height:0;border:10px solid " + label_data[k].color + ";overflow:hidden");
                            // HTML 속성에 상태 데이터를 저장
                            color_box_el.setAttribute(DATA_LEGEND_LABEL, label_data[k].label);
                            color_box_el.setAttribute(DATA_LEGEND_HIGHLIGHTED, "false");
                            td_el_color.append(color_box_el);
                        }
                        // TEXT
                        td_el_text.innerText = label_data[k].label;
                        // HTML 속성에 상태 데이터를 저장
                        td_el_text.setAttribute(DATA_LEGEND_LABEL, label_data[k].label);
                        td_el_text.setAttribute(DATA_LEGEND_CHECKED, "true");
                        k++;
                    }
                }
                catch (e) {
                    // console.error(label_data[k]);
                    // console.error(label_data[k-1]);
                }
                tr_el.append(td_el_color, td_el_text);
            }
            table_el.append(tr_el);
        }
        placeholder.append(table_el);
        // LEGEND INIT  
        toggle_all_on_legend();
        // EVENT BINDING -- SELECTED LEAGEND
        var selected_el = document.querySelector("#selected_legend");
        if (selected_el)
        selected_el.addEventListener("click", init_select_highlighted);
        // EVENT BINDING -- CLEAR LEAGEND
        var clear_legend = document.querySelector("#clear_legend");
        if (clear_legend) {
            clear_legend.addEventListener("click", function (e) {
                if (clear_legend.getAttribute("toggle") == "on") {
                    line_all_off();
                    toggle_all_off_legend();
                    clear_legend.innerText = "전체";
                    clear_legend.setAttribute("toggle", "off");
                } else {
                    line_all_on();
                    toggle_all_on_legend();
                    clear_legend.innerText = "클리어";
                    clear_legend.setAttribute("toggle", "on");
                }
            });
        }
        
        // EVENT BINDING -- EACH LEGEND
        var text_el = document.querySelectorAll(".legend_text");
        var color_el = document.querySelectorAll(".legend_color");
        
        for (var i = 0; i < text_el.length; i++) {
            text_el[i].onclick = function (e) {
                var el = e.target;
                // 실선 토글
                toggle_flot_by_label(el.getAttribute(DATA_LEGEND_LABEL));
                // 범례 토글 
                toggle_legend(e.target);
            };
            color_el[i].onclick = function (e) {
                var el = e.target;
                // 범례 하이라이트
                toggle_highlight_line_by_label(el.getAttribute(DATA_LEGEND_LABEL));
                // 범례 컬러박스 토글
                toggle_color_box(e.target);
            };
        }
    }
    
    function init_select_highlighted() {
        // 선택된 애들만 켜지도록 해야됨.
        var selected_el = document.querySelectorAll(".legend_color [" + DATA_LEGEND_HIGHLIGHTED + "='true']");
        // 그래프 선 부분
        line_all_off();
        selected_el.forEach(function (el) { return line_on_by_label( el.getAttribute(DATA_LEGEND_LABEL) || "" ); });
        // 범례 부분
        toggle_all_off_legend();
        selected_el.forEach(function (el) {
            if (el.parentElement == null || el.parentElement.nextElementSibling == null) { console.error("다음 엘리먼트가 없습니다."); return ; }
            toggle_on_legend( el.parentElement.nextElementSibling );
        });
    }
    
    function toggle_color_box(target) {
        if(target == null || target.parentElement == null) { console.error("toggle_color_box()에 필요한 요소가 없습니다."); return; }
        let p_el = target.parentElement;
        if (target.getAttribute(DATA_LEGEND_HIGHLIGHTED) == "false") {
            // style_target_el.style = "background-color: yellow;";
            p_el.style = "border: 2px solid black;";
            target.setAttribute(DATA_LEGEND_HIGHLIGHTED, "true");
        } else {
            // style_target_el.style = "background-color: none;";
            p_el.style = "border: none;";
            target.setAttribute(DATA_LEGEND_HIGHLIGHTED, "false");
        }
    }
    
    function toggle_legend(target) {
        if (target.getAttribute(DATA_LEGEND_CHECKED) == "true")
        toggle_off_legend(target);
        else
        toggle_on_legend(target);
    }
    
    function line_on_by_label(label) {
        var d = g_graph_inst.getData();
        for (var idx = 0; idx < d.length; idx++) {
            if (d[idx].label.includes(label)) {
                d[idx].lines.show = true;
            }
        }
        g_graph_inst.draw();
    }
    
    function toggle_highlight_line_by_label(label) {
        var d = g_graph_inst.getData();
        for (var idx = 0; idx < d.length; idx++) {
            if (d[idx].label.includes(label)) {
                toggle_highlight_line(d[idx]);
            }
        }
    }
    Interface.toggle_highlight_line_by_label = toggle_highlight_line_by_label;
    
    function toggle_highlight_line(serie) {
        if (series.lines.lineWidth < 2) {
            series.lines.lineWidth *= 3;
        } else {
            series.lines.lineWidth = 1.5;
        }
        g_graph_inst.draw();
    }
    
    var recovery_btn_state = {
        toggle_on: false,
        url: '/ALL/data/data_1424__1524.tsv'
    };
    // EVENT HANDLER
    // g_el.recovery_btn.onclick = function (e) {
    //     if(recovery_btn_state.toggle_on) recovery_btn_state.toggle_on = false;
    //     else recovery_btn_state.toggle_on = true;
    //     recovery_btn_render();
    //     get_data(recovery_btn_state.url, g_event_url);
    // }
    // FUNCTION
    var recovery_btn_render = function () {
        if(g_el.recovery_btn == null) { console.error("recovery_btn 이 없습니다."); return; }
        if (recovery_btn_state.toggle_on)
        g_el.recovery_btn.disabled = false;
        else
        g_el.recovery_btn.setAttribute("disabled", "true");
    };
    
    var g_subgraph_inst;
    var g_event_data;
    var _CSV_TYPE_ = "RAW_DATA";
    // var g_data_url        = "/ALL/data/data_1424__1524.tsv";
    window.g_data_url = null;
    
    // >>> 241010 hjkim - 이벤트 수신 경로 변경
    window.g_event_url = "/ALL/data/raw/event.csv";
    window.g_event_url = (y = "2024", m = "10", d = "7", stack = "F001") => {
        // return `/get_event_test.php?y=${y}&m=${m}&d=${d}&stack=${stack}`;
        return `/FDC/Proj/TRUNK/js/bop/get_event.php?y=${y}&m=${m}&d=${d}&stack=${stack}`;
		// return "/ALL/data/raw/event.csv";
        // return `/FDC/Proj/mjkoo/js/bop/get_event.php?y=${y}&m=${m}&d=${d}&stack=${stack}`;
    }
    // <<< 241010 hjkim - 이벤트 수신 경로 변경
    
    var fn_onload = function() {
        
        // 카랜덱스 초기화 후, 그래프 초기화
        // Calendex.init(function () {
        
        // 	var _retry_cnt = 0;
        // 	var _retry: IntervalID = setInterval(() => {
        // 		if(_retry_cnt++ > 100) clearInterval(_retry);
        // 		if(window.g_data_url == null) return;
        // 		get_data(window.g_data_url, g_event_url); 
        // 		clearInterval(_retry);
        // 	}, 100);
        // 	//get_data(g_data_url, g_event_url);
        // 	setInterval(refresh_graph, 60000);
        // });
        
        // EVENT HANDLER
        // 데이터 선택 시에 실행
        // let fn_change_sel_data_url_handler: EventListener = (e: any) => {
        //     // CLEAR
        //     Calendex.init();
        //     g_graph_inst.destroy();
        //     // $FlowFixMe
        //     $(g_el.graph).off("plotclick").off("plotselected").off("plothover");
        //     // INIT
        //     window.g_data_url = e.target.value;
        //     get_data(window.g_data_url, g_event_url);
        // };
        
        // if(g_el.sel_data_url !== null) g_el.sel_data_url.addEventListener("change", fn_change_sel_data_url_handler);
        // // 라벨 그룹 선택 시에 실행
        // if(g_el.sel_label_group !== null) g_el.sel_label_group.addEventListener("change", refresh_legend);
    };
    /* -------------------------------------------------------------------------- */
    /*                                  EVENT HANDLER                             */
    /* -------------------------------------------------------------------------- */
    function run_diagnostic(url, p_url) {
        window.g_data_url = url;
        recovery_btn_state.toggle_on = true;
        recovery_btn_state.url = p_url;
        recovery_btn_render();
        // >>> 241010 hjkim - 이벤트 경로 수정
        let _t = new Date();
        let _ymd = [_t.getFullYear(), (_t.getMonth()+1), _t.getDate()];
        get_data( window.g_data_url, window.g_event_url(_ymd[0], _ymd[1], _ymd[2], STACK_NAME()) );
        // <<< 241010 hjkim - 이벤트 경로 수정
    }
    function zoom_in() {
        console.warn("Warning: zoom_in():L688 is deprecated.", TITLE);
        var sel = g_graph_inst.getSelection();
        // $.each(plot.getXAxes(), function(_, axis) {
        //     var opts = axis.options;
        //     opts.min = ranges.xaxis.from;
        //     opts.max = ranges.xaxis.to;
        // });
        g_graph_inst.getXAxes().map(function (axis, idx) {
            var opts = axis.options;
            opts.min = sel.xaxis.from;
            opts.max = sel.xaxis.to;
        });
        g_graph_inst.setupGrid();
        g_graph_inst.draw();
        g_graph_inst.clearSelection();
    }
    function zoom_out() {
        console.warn("Warning: zoom_out():L705 is deprecated.", TITLE);
        g_graph_inst.getXAxes().map(function (axis, idx) {
            var opts = axis.options;
            delete opts.min;
            delete opts.max;
        });
        g_graph_inst.setupGrid();
        g_graph_inst.draw();
        g_graph_inst.clearSelection();
    }
    /* -------------------------------------------------------------------------- */
    /*                                  FUNCTION SET                              */
    /* -------------------------------------------------------------------------- */
    //(A)BM, (A)AM, (A)Bl, (A)FL, (A)Pr, (W)Hu, (W)SI, (W)SO, (H)EX, (H)DI, (H)Wa, (H)SI, (H)SO, (H)EO
    // var graph_el = document.querySelector("#graph");

    function mark_flot(json) {
        var line_opt = init_line_opt(g_graph_data);
        // >>>>>>> 그래프에 마킹
        line_opt = init_mark_opt(line_opt, g_graph_data, json);
        // <<<<<<< 그래프에 마킹
        // $FlowFixMe
        g_graph_inst = $.plot(g_el.graph, g_graph_data, line_opt);
        //
        var CLICK_CNT = 0;
        var TIME_QUEUE = [];
        var FIRST_CLICK = 0;
        var DELAY = { SINGLE: 250, DOUBLE: 500, TIMEOUT: 750, DROP: 1000 };
        // 
        function clear_time_queue() {
            for (var i = 0; i < TIME_QUEUE.length; i++) {
                clearTimeout(TIME_QUEUE[i]);
            }
            CLICK_CNT = 0;
            TIME_QUEUE = [];
        }
        // $FlowFixMe
        $(g_el.graph)
        .on("plotclick", function (event, pos, item) {
            if(is_title("대시보드")) {
                // let rand = Math.floor(Math.random() * 15);
                // alert("Result : " + rand);
                // const SEND_RESULT = new CustomEvent("DASHBOARD/LISTEN_RESULT", 
                //     // { detail : { result : xy[0][1]} });
                //     { detail : { result : rand } });
                // window.dispatchEvent(SEND_RESULT);

                let result = g_graph_data.filter( (d) => d.label == "Result" );
                let xy = result[0].data.filter( (d) => { 
                    if(Math.abs(pos.x - d[0]) < 10000) return true;
                    else false;
                });
                // 메시지 큐에 전송
                console.log(`Result : ${xy[0][1]}`);
                // alert(`Result : ${xy[0][1]}`);
                const SEND_RESULT = new CustomEvent("DASHBOARD/LISTEN_RESULT", 
                    { detail : { result : xy[0][1]} });
                window.dispatchEvent(SEND_RESULT);
            }
            if (item == undefined) return;

            if(0) {
            // if(is_title("대시보드")) {
                CLICK_CNT++;
                if (CLICK_CNT == 1) {
                    FIRST_CLICK = new Date().getTime();
                    function packet1() {
                        console.log("[plotclick]", item.series);
                        // 범례 하이라이트
                        toggle_highlight_line(item.series);
                        var label = item.series.label;
                        var elm                    = document.querySelector(`["${DATA_LEGEND_LABEL}=${label}"]`);
                        if(elm == null) { console.error("elm 이 없습니다."); return; }
                        // 범례 컬러박스 토글
                        toggle_color_box(elm);
                        // CLEAR
                        clearTimeout(TIME_QUEUE[0]);
                        clearTimeout(TIME_QUEUE[2]);
                        CLICK_CNT = 0;
                        TIME_QUEUE = [];
                    }
                    function packet2() {
                        console.log("[plotdblclick]", item.series);
                        // TODO: 그래프 확대
                        clear_time_queue();
                    }
                    function packet3() {
                        console.log("[plottripleclick]", event, pos, item);
                        // TODO: 선 하나만 표시
                        // CLEAR
                        clearTimeout(TIME_QUEUE[0]);
                        clearTimeout(TIME_QUEUE[1]);
                    }
                    function drop_packet() {
                        console.log("[drop]", event, pos, item);
                        clear_time_queue();
                    }
                    TIME_QUEUE.push(setTimeout(packet1, DELAY.SINGLE));
                    TIME_QUEUE.push(setTimeout(packet2, DELAY.DOUBLE));
                    TIME_QUEUE.push(setTimeout(packet3, DELAY.TIMEOUT));
                    TIME_QUEUE.push(setTimeout(drop_packet, DELAY.DROP));
                } else if (CLICK_CNT == 2) {
                    if ((new Date().getTime() - FIRST_CLICK) <= DELAY.DOUBLE) {
                        // console.log("double click", TIME_QUEUE);
                        clearTimeout(TIME_QUEUE[0]); // SINGLE CLICK 취소
                    } else {
                        // console.log("loose double click", TIME_QUEUE);
                        clear_time_queue();
                    }
                } else {
                    // console.log("triple click", CLICK_CNT, TIME_QUEUE);
                    clearTimeout(TIME_QUEUE[0]); // SINGLE CLICK 취소
                    clearTimeout(TIME_QUEUE[1]); // DOUBLE CLICK 취소
                    CLICK_CNT = 0;
                }
            }

        })
        .on("plotselected", function (e, ranges) {
            if(is_title("BOP진단")) {
                // >>> 240722 hjkim - 그래프 드래그의 시간 데이터
                set_selected_label(ranges.xaxis.from, ranges.xaxis.to);
                // <<< 240722 hjkim - 그래프 드래그의 시간 데이터
            }
        });
        // INIT FLOT DEFAULT SELECTION
        g_graph_inst.setSelection({ yaxis: { from: 0, to: 100 } });
    }
    Interface.mark_flot = mark_flot;
    
    function ParseCSVToKeyValueJSON(txt) {
        var header;
        var json = txt.split("\n").map((row, idx) => {
            var map;
            header = row.split(",");
            if(idx != 0) { 
                header.map((col, jdx) => map[header[jdx]] = col); 
            }
            return map;
        })
        .reduce((acc, d, i) => {
            if(i == 0) return acc;
            else { acc.push(d); return acc; }
        }, []);
        return json;
    }
    
    function xhr1_resolve(response) {
        // euc-kr decode
        var euckr_data = new Uint8Array(response);
        var decoder = new TextDecoder('euc-kr');
        var data = decoder.decode(euckr_data);
        _CSV_TYPE_ = "RAW_DATA";
        //
        var json              = DataPreprocessing.parse_csv(data);
        if (json.length == 0) throw "csv 내용이 없습니다.";
        
        var currentVal        ;
        if (json.length <= 100) {
            currentVal = json[json.length - 1].Current;
        } else {
            currentVal = json[99].Current;
        }
        
        var currentValInt = Math.round(parseInt(currentVal) * 10) / 10;
        var currentValDiv = document.getElementById("current_val");
        if(currentValDiv !== null) currentValDiv.innerHTML = "Current : " + currentValInt + "A";
        
        // >>> CHECK TIME ORDERING
        var time_order_idx = [], time_order_cnt = 0;
        for (var i = 0; i < json.length - 1; i++) {
            if (json[i].Time > json[i + 1].Time) {
                time_order_idx.push(i);
                time_order_cnt++;
            }
        }
        
        if (time_order_cnt > 0) {
            var msg = time_order_cnt + "개의 시간이 정렬 되어있지 않습니다.";
            // alert(msg);
            console.error(msg, time_order_idx.join(","));
        }
        // <<< CHECK TIME ORDERING
        
        var header_list = Object.keys(json[0]);
        // >>> 240112 hjkim - SW센서 / BOP 진단결과
        if(g_is_sw_sensor_graph) {
            var flot_json              ;
            // >>> 240122 hjkim - SW센서 / 소프트 그래프
            if(!SW_SENSOR_RAW_REUSE && g_ma_list && g_ma_list.length > 0) { 
                if(g_el.yearly == null) { throw "yearly 요소가 없습니다."; }
                if(g_el.monthly == null) { throw "monthly 요소가 없습니다."; }
                if(g_el.daily == null) { throw "daily 요소가 없습니다."; }
                if(g_ma_list[0] == null) { throw "g_ma_list 내용이 없습니다."; }
                var _ma_url = `${BASE_DATA_URI()}/${g_el.yearly.value}/${g_el.monthly.value}/${g_el.daily.value}/${g_ma_list[0]}`;
                var _once = true;
                fetch(_ma_url).then(d => d.text())
                .then((txt) => ParseCSVToKeyValueJSON(txt))
                .then((json) => DataPreprocessing.json_to_flotdata(json))
                // .then(debug => {console.log("debug:", debug); return debug;})
                // .then(flot_data => flot_data.filter(d => ((d.label.indexOf("R_") > -1) || (d.label.indexOf("Result") > -1))) )
                // .then((flot_data) => flot_data.filter((d) => ((d.label.indexOf("R_") > -1))))
                // .then(soft_sensor => {
                //     if(soft_sensor.length) SoftSensor.Init_sw_sensor_graph(soft_sensor);
                //     else { console.error("MA를 fetch 했지만, Soft 센서가 데이터가 없음!");
                //     SoftSensor.Init_sw_sensor_graph({});
                //     }
                // });
            } else {
                flot_json = DataPreprocessing.json_to_flotdata(json);
                var soft_sensor = flot_json.filter(
                    (d) => (d.label.indexOf("R_") > -1)
                );
                if(soft_sensor.length) {
                    SoftSensor.Init_sw_sensor_graph(soft_sensor);
                } else {
                    console.error("raw데이터를 REUSE 했지만, Soft 센서 데이터가 없음!");
                    SoftSensor.Init_sw_sensor_graph({});
                };
            }
            // <<< 240122 hjkim - SW센서 / 소프트 그래프
            SoftSensor.Init_bop_barchart(json);
            // g_graph_data = json.filter(d => ((d.label.indexOf("R_") < 0) && (d.label.indexOf("Result") < 0)) ); // SW센서 제외
            if(flot_json == null) { throw "flot_json 이 없습니다."; }
            g_graph_data = flot_json.filter( (d)  => (
                (d.label.indexOf("P_A_m_out") == 0) ||
                (d.label.indexOf("P_A_B_in") == 0)  ||
                (d.label.indexOf("Air") == 0) 	||
                (d.label.indexOf("MFM3") == 0) 	||
                (d.label.indexOf("T_A_S_in") == 0)  ||
                (d.label.indexOf("T_A_S_out") == 0) ||
                (d.label.indexOf("T_A_vent") == 0)  ||
                (d.label.indexOf("DI(") == 0) 	||
                (d.label.indexOf("Water") == 0) 	||
                (d.label.indexOf("T_w_h_in") == 0) 	||
                // >>> 240306 hjkim - 주요 변수 추가
                (d.label.indexOf("T_w_h_out") == 0)
                // >>> 240306 hjkim - 주요 변수 추가
                // >>> 240307 hjkim - 주요 변수 추가
                || (d.label.indexOf("T_A_B_in") == 0)
                || (d.label.indexOf("T_A_m_out") == 0)
                || (d.label.indexOf("P_A_S_in") == 0)
                || (d.label.indexOf("P_A_S_out") == 0)
                || (d.label.indexOf("T_w_t_in") == 0)
                || (d.label.indexOf("T_w_t_out") == 0)
                || (d.label.indexOf("P_w_p_in") == 0)
                || (d.label.indexOf("P_w_p_out") == 0)
                || (d.label.indexOf("MFM1") == 0)
                || (d.label.indexOf("P_w_h_out") == 0)
                || (d.label.indexOf("T_DI_h_out") == 0)
                || (d.label.indexOf("T_DI_s_out") == 0)
                || (d.label.indexOf("DI_Conductivity") == 0)
                || (d.label.indexOf("P_DI_p_in") == 0)
                || (d.label.indexOf("P_DI_p_out") == 0)
                || (d.label.indexOf("MFM2") == 0)
                || (d.label.indexOf("T_DI_S_in") == 0)
                || (d.label.indexOf("T_F_S_in") == 0)
                || (d.label.indexOf("T_F_S_out") == 0)
                || (d.label.indexOf("P_F_S_in") == 0)
                || (d.label.indexOf("MFC1") == 0)
                || (d.label.indexOf("MFC2") == 0)
                || (d.label.indexOf("Voltage") == 0)
                || (d.label.indexOf("Current") == 0)
                // <<< 240307 hjkim - 주요 변수 추가
            )); // 범례 센서 리스트
        } else {
            g_graph_data  = DataPreprocessing.json_to_flotdata(json);
        }
        return g_graph_data;
    }
       
    function _get_location(href) {
        var l = document.createElement("a");
        l.href = href;
        return l;
    }
		// >>> 241011 hjkim - get_event.php 전처리 부분
	window.data_classify = (_csv, _filter = 0) => {
		let rows = _csv.split("\n");
       if(rows.length == 0) return [];
        // >>> 241101 hjkim - 스택바 차트 데이터 경로 수정
		return rows.filter(row => {
			return (row.indexOf(_filter+",") == 0)
		})
        .map(row => {
            let cols = row.split(",");
            cols.shift();
            return cols.join(",");
        }).join("\n");
            // <<< 241101 hjkim - 스택바 차트 데이터 경로 수정

            // console.log("!@#$ filtered_rows : ", filtered_rows);
			// let cluttered_rows = filtered_rows.map(row => {
			// 	let cols = row.split(",");
			// 	cols.shift();
            //     return cols.join(",");
			// });
            // console.log("!@#$ cluttered_rows : ", cluttered_rows);
			// return cluttered_rows.join("\n");
	};
		
    // <<< 241011 hjkim - get_event.php 전처리 부분
    function get_data(data_url, event_url, cb_done) {
        // var url = "/HJ_FOLDER/230106__guided_chart/sample_data.csv";
        // 2개의 XHR을 동기화 하는 플래그
        var xhr1_complete = false;
        var xhr2_complete = false;
        // var xhr3_complete = false;
        // function is_complete_all() { return xhr1_complete && xhr2_complete && xhr3_complete; }
        function is_complete_all() { return xhr1_complete && xhr2_complete; }
        var xhr1 = new XMLHttpRequest();
        var xhr2 = new XMLHttpRequest();
        // var xhr3 = new XMLHttpRequest();
        xhr1.open("GET", data_url, true); // 상단 그래프 데이터 & 하단 그래프 데이터
        // >>>>>>> 230531 hjkim - 파일 캐시 요청
        _cache_work(xhr1, data_url);
        // <<<<<<< 230531 hjkim - 파일 캐시 요청
        //xhr1.setRequestHeader("Accept", "text/csv");
        xhr1.responseType = 'arraybuffer';
        xhr2.open("GET", event_url, true); // 상단 그래프 이벤트 데이터
        // xhr3.open("GET", 'min_max.csv'+"?cache_disabled="+new Date().getTime(), true);  // 상단 그래프 min/max 데이터
        xhr1.addEventListener("load", function (res) {
            if (res.target == null)
            throw "target is null";
            xhr1_complete = true;
                resolve_all();
        });
        xhr2.addEventListener("load", function (res) {
            // 가이드선 그리기
            if (res.target == null)
            throw "target is null";
            xhr2_complete = true;
            resolve_all();
        });
        // xhr3.addEventListener("load", function(res) {
        //     // 가이드선 그리기
        //     if(res.target == null) throw "target is null";
        //     xhr3_complete = true;
        //     resolve_all();
        // });
        xhr1.send(); // 그래프 
        xhr2.send();
        // xhr3.send();
        // -------------------------------------
        function resolve_all() {
            if (is_complete_all()) {
                // >>>>>>> 230531 hjkim - 파일 캐시 작업
                if (xhr1.getResponseHeader("Last-Modified") != null) {
                    // console.log("#cache", xhr1.responseURL, xhr1.getResponseHeader("Last-Modified"));
                    localStorage.setItem(_get_location(xhr1.responseURL).pathname, xhr1.getResponseHeader("Last-Modified"));
                }
                // <<<<<<< 230531 hjkim - 파일 캐시 작업
                g_graph_data = xhr1_resolve(xhr1.response);
                xhr2_resolve();
                crosshair_resolve();
                // 230324 hjkim - HIDE Series
                try {
                    document.querySelectorAll(".legend_text")[35].click();
                    document.querySelectorAll(".legend_text")[36].click();    
                } catch (error) {
                    //console.error("범례 div가 마련되지 않았습니다.");
                }                
                // >>> 240112 hjkim - SW센서 / BOP 진단결과
                if(g_graph_data.length) {
                    let stimestamp = g_graph_data[0].data[0][0];
                    let etimestamp = g_graph_data[0].data[g_graph_data[0].data.length-1][0];
                    // >>> 240222 hjkim - stack bar 드로잉
                    let _filtered_data = g_impedentce_uri_list
                    .filter(d => (stimestamp <= d.timestamp && d.timestamp <= etimestamp));
                    let unique_ts_arr = [... new Set(_filtered_data)];
                    SoftSensor.Init_stack_barchart(_filtered_data, stimestamp, etimestamp);
                    // <<< 240222 hjkim - stack bar 드로잉
                }
                    
                // $FlowFixMe
                document.body.dispatchEvent(new CustomEvent("data_refreshed"));
                // <<< 240112 hjkim - SW센서 / BOP 진단결과
                // >>> 240307 hjkim - 	
                if(cb_done) cb_done();
                // <<< 240307 hjkim - 
            }
        }
			
        function xhr2_resolve() {
            // 이벤트 데이터 파싱 후 전역변수(g_event_data)에 저장
            _CSV_TYPE_ = "EVENT_DATA";
            var data = xhr2.responseText;
			// >>> 241011 hjkim - get_event.php 전처리 부분
			if (data.indexOf("0,") == 0 || data.indexOf("1,") == 0) {
                data = window.data_classify(data, 0);
				data = "sTime,eTime,Type,Amp,Memo\n"+data;
			}
			// <<< 241011 hjkim - get_event.php 전처리 부분
            var event_json               = DataPreprocessing.parse_csv_event(data);
            g_event_data = event_json;
                
            var _retry_cnt = 0;
            var _retry            = setInterval( () => {
                if(_retry_cnt++ > 100) clearInterval(_retry);
                if(g_graph_data == null) return;
                // 그래프에 마킹
                mark_flot(event_json);
                clearInterval(_retry);
            }, 500);
                
            if(g_el.custom_legend == null) return;
            g_el.custom_legend.innerHTML = "";
            make_legend(4, g_graph_data);
            // var subgraph_json = g_graph_data.filter(function (n, i, arr) { return (n.label.includes("Result")); });
                
            // SUBGRAPH PART
            try {
                // $FlowFixMe
                BarcodeChart.IBarcode_chart_done();
                // $FlowFixMe
            BarcodeChart.IBarcode_chart_init(g_impedentce_uri_list);    
            } catch (error) {
                //console.error("BarcodeChart js가 로딩되지 않았습니다.");
            }        
        }
            
        function crosshair_resolve() {
            // 230324 hjkim - Plot Crosshair Sync
            // $FlowFixMe
            $(g_el.graph).bind("plothover", function (e, pos) {
                // g_subgraph_inst.setCrosshair(pos); 
                try {
                    // $FlowFixMe
                    if (BarcodeChart.IBarcode_vertical_crosshair != undefined) {
                        // $FlowFixMe
                        BarcodeChart.IBarcode_vertical_crosshair(pos.pageX);
                    }
                } catch (error) {
                    //console.error("BarcodeChart가 로딩되지 않았습니다.");
                }
            });
            // $FlowFixMe
            $(g_el.subgraph).bind("plothover", function (e, pos) { g_graph_inst.setCrosshair(pos); });
        }
    }
    var COLOR_RED_OPACITY = "rgba(255, 0, 0, 1)";
    var COLOR_GREY = "rgba(128, 128, 128, 1)";
    var COLOR_GREY_OPACITY = "rgba(128, 128, 128, .5)";
    var COLOR_GREEN_OPACITY = "rgba(0, 255, 0, .5)";
    var COLOR_GREEN = "rgba(0, 255, 0, 1)";
    var COLOR_CYAN_OPACITY = "rgba(0, 255, 255, .5)";
    var COLOR_CYAN = "rgba(0, 255, 255, 1)";
    var COLOR_YELLOW_OPACITY = "rgba(255, 255, 0, .5)";
    var COLOR_YELLOW = "rgba(255, 255, 0, 1)";
    var COLOR_BLACK = "rgba(0, 0, 0, 1)";
    var g_toggle_marking = true;
    
    function toggle_marking() {
        if (g_toggle_marking) {
            g_toggle_marking = false;
            clear_mark_opt();
        } else {
            g_toggle_marking = true;
            init_mark_opt(g_graph_inst.getOptions(), g_graph_data, g_event_data);
        }
    }
    
    function clear_mark_opt() {
        g_graph_inst.getOptions().grid.markings = function () { return false; };
        g_graph_inst.draw();
    } 

    function init_mark_opt(option, data, event) {
        // 
        if (event == undefined || event == null)
        throw "init_mark_opt() arg2 error.";
        // 
        function get_marking() {
            // [ {sTime: unixtime, eTime: unixtime, Memo: string}, ...]
            var r = [];
            for (var i = 0; i < event.length; i += 1) {
                // if(event[i].Memo.includes("정상")) {
                var tag_pos        = 0;
                // >>>>>>> 이벤트 유형 분류
                try {
                    if (event[i].Type.includes('N')) { // N_ : 정상
                        r.push({ color: COLOR_GREEN_OPACITY, xaxis: { from: event[i].sTime, to: event[i].eTime } }); // 레이블 마커 색칠
                        tag_pos = (event[i].eTime - event[i].sTime) / 2 + event[i].sTime;
                        r.push({ color: COLOR_GREEN, xaxis: { from: tag_pos, to: tag_pos - 1, tag: event[i].Memo } }); // 레이블 태그명
                    } else if (event[i].Type.includes('C')) { // C_ : 온도
                        tag_pos = (event[i].eTime - event[i].sTime) / 2 + event[i].sTime;
                        r.push({ color: COLOR_GREY, xaxis: { from: tag_pos, to: tag_pos, tag: event[i].Memo } }); // 레이블 태그명
                    } else if (event[i].Type.includes('IM')) { // IM : 임피던스 측정
                        r.push({ color: COLOR_YELLOW_OPACITY, xaxis: { from: event[i].sTime, to: event[i].eTime } }); // 레이블 마커 색칠
                        tag_pos = (event[i].eTime - event[i].sTime) / 2 + event[i].sTime;
                        r.push({ color: COLOR_BLACK, xaxis: { from: tag_pos, to: tag_pos - 1, tag: event[i].Memo } }); // 레이블 태그명
                    } else { // FT : 실패 등등..
                        r.push({ color: COLOR_GREY_OPACITY, xaxis: { from: event[i].sTime, to: event[i].eTime } }); // 레이블 마커 색칠
                        tag_pos = (event[i].eTime - event[i].sTime) / 2 + event[i].sTime;
                        r.push({ color: COLOR_RED_OPACITY, xaxis: { from: tag_pos, to: tag_pos - 1, tag: event[i].Memo } }); // 레이블 태그명
                    }
                } catch(err) { console.log(err); }
            }
            return r;
        }
        //
        option.grid.markings = function () { return get_marking(); };
        return option;
    }        
        
    // >>> 240625 hjkim - add graph marking
    Interface.init_mark_opt = init_mark_opt;
    // <<< 240625 hjkim - add graph marking 
    function refresh_graph() {
        if (g_el.auto_reload != null && !g_el.auto_reload.checked) return; // 자동갱신 ON/OFF
        var xhr = new XMLHttpRequest();
        
        xhr.open("GET", window.g_data_url, true);
        // >>>>>>> 230531 hjkim - 파일 캐시 요청
        _cache_work(xhr, window.g_data_url);
        // <<<<<<< 230531 hjkim - 파일 캐시 요청
        xhr.responseType = 'arraybuffer';
        
        xhr.addEventListener("load", function (res) {
            g_graph_data = xhr1_resolve(xhr.response);
            
            // REFRESH GRAPH
            setTimeout(() => {
                var line_opt = init_line_opt(g_graph_data);
                init_mark_opt(line_opt, g_graph_data, g_event_data);
                g_graph_inst.setData(g_graph_data);
                g_graph_inst.setupGrid();
                g_graph_inst.draw(); 
                // >>> 240306 hjkim - 데이터 갱신 후, 범례 토글
                // $FlowFixMe
                document.body.dispatchEvent(new CustomEvent("data_refreshed"));	
                // <<< 240306 hjkim - 데이터 갱신 후, 범례 토글
            }, 100);
            refresh_legend(null);
            // REFRESH BARCORD CHART
            // $FlowFixMe
            if(typeof BarcodeChart != 'undefined') {
                // $FlowFixMe
                BarcodeChart.IBarcode_chart_done();
                // $FlowFixMe
                BarcodeChart.IBarcode_chart_init(g_impedentce_uri_list);
            }
        });
        xhr.send(null);
    }        
    function init_line_opt(data) {

        function toolTipFuncForTraffic(label, xval, yval, flotItem) {
            // console.log("tooltip/data", data);
            // var data = g_graph_data; // 230316 hjkim - 그래프 갱신 후, 툴팁 오류 수정
            // 범례명 : label
            // x축 값 : xval
            // y축 값 : yval
            // 그래프 옵션 : flotItem
            var html = "<b>▶%x</b><br>";
            var xpos = flotItem.datapoint[0];
            var ypos = flotItem.datapoint[1];
            var timestamp = Math.floor(xpos / 1000) * 1000;
            var adjXpos;
            var i;
            var max;
            // 스플라인을 위한 x축 인덱스 조정.
            for (i = 0, max = data[0].data.length; i < max; i += 1) {
                if (timestamp == data[0].data[i][0]) {
                    adjXpos = i;
                    break;
                }
            }
            // bps 차트 툴팁
            for (i = 0, max = data.length; i < max; i += 1) {
                // if (i === max / 2) {
                //     html += "<hr style='border-top: 1px solid #333; margin: 3px 0px;'></hr>";
                // }
                if (flotItem.seriesIndex === i) {
                    // 선택한 시계열 하이라이트 처리
                    html += "<div style='width:4px;height:0;border:5px solid ";
                    html += data[i].color + ";overflow:hidden;display:inline-block;'></div> ";
                    // 레이블 명
                    html += "<b><u>" + data[i].label + ":" + (ypos);
                    // 데이터 값
                    html += "</u></b>" + "<br>";
                } else {
                    html += "<div style='width:4px;height:0;border:5px solid ";
                    html += data[i].color + ";overflow:hidden;display:inline-block;'></div> ";
                    // 레이블 명 : 데이터 값
                    html += data[i].label + ":" + (data[i].data[flotItem.dataIndex][1]);
                    html += "<br>";
                }
            }
            return html;
        }
        var line_opt = {
            series: {
                stack: false,
                lines: { show: true, lineWidth: 1.5 },
                // curvedLines: {
                //     apply: true, active: true, monotonicFit: true
                // },
                shadowSize: 0
            },
            legend: {
                show: false,
                container: document.querySelector("#legend_container"),
                noColumns: 4
            },
            axisLabels: { show: true },
            xaxis: {
                position: "bottom",
                axisLabel: "Time",
                show: true,
                          //mode: null,
                          //timezone: null,
                mode: "time",
                timezone: "browser",
                tickLength: 0
            },
            yaxis: {
                axisLabel: "℃", labelWidth: 30, autoscalMargin: 0.02
            },
            yaxes: [{
                position: "left", axisLabel: "℃", show: true, min: -5, max: 100,
                tickFormatter: function (v        , axis        ) { return (v * 1).toFixed(axis.tickDecimals) + "℃"; }
            }, {
                position: "right", axisLabel: "kPa", min: -10, max: 120,
                tickFormatter: function (v        , axis        ) { return (v * 1).toFixed(axis.tickDecimals) + "kPa"; }
            }],
            crosshair: {
                mode: "x",
                color: "rgba(200, 0, 0, 0.7)",
                lineWidth: 1
            },
            selection: {
                mode: "x",
                color: "#00BFFF",
                minSize: 10 //number of pixels
            },
            grid: {
                backgroundColor: "white",
                clickable: true,
                hoverable: true,
                autoHighlight: true,
                borderColor: {
                    top: "#e8e8e8",
                    right: "#e8e8e8",
                    bottom: "#e8e8e8",
                    left: "#e8e8e8"
                },
                margin: {
                    top: 30,
                    right: 10,
                    bottom: 20
                },
                borderWidth: {
                    top: 2,
                    right: 2,
                    bottom: 2,
                    left: 2
                }
            },
            tooltip: {
                show: true,
                cssClass: "flotTip",
                content: toolTipFuncForTraffic
                // xDateFormat: "%y-%m-%d %h:%M:%S"
            }
        };
        return line_opt;
    }
    g_FlotOption.init_line_opt = init_line_opt;        
        
    function parse_query_string(qs) {
        var kv_arr = location.search.substr(1).split("&");
        if (kv_arr.length == 0)
        return {};
        var result = {};
        for (var i = 0; i < kv_arr.length; ++i) {
            var kv = kv_arr[i].split("=", 2);
            if (kv.length == 1) result[kv[0]] = "";
            else result[kv[0]] = decodeURIComponent(kv[1].replace(/\+/g, " "));
        }
        return result;
    }
        
    var qs = parse_query_string(location.search);
    var arr = [];
    if (qs.result != undefined) {
        arr = qs.result.trim().split(",");
    }
    // 230116 hjkim - DataPreprocessing : Pure function -> Object
    // $FlowFixMe
    var DataPreprocessing = {};
        
    // $FlowFixMe
    DataPreprocessing.g_filter_arr = get_sensor(arr[0], arr[1]);
        
    // $FlowFixMe
    DataPreprocessing.parse_xsv = function(text, DELIM) {
        if (text == undefined) {
            throw "parse_tsv() arg1 is null";
        }
        if (DELIM != "\t" && DELIM != ",")
        throw "parse_xsv() arg2 is error.";
        var json = [];
        text = text.trim();
        var rows = text.split("\n");
        var header = rows[0].split(DELIM);
        this.trim_all(header);
        // >>> Find Time Column
        var TIME_COLUMN = 1;
        for (var i = 0; i < header.length; i += 1) {
             if (header[i].includes("Time")) TIME_COLUMN = i;
        }
        // console.log("!@#$ TIME_COLUMN, rows.length: ", TIME_COLUMN, rows.length);
        if (i == header.length) i = -1;
        // <<< Find Time Column
        for (i = 1; i < rows.length; i += 1) {
            if(rows[i][0] == "#" && rows[i][1] == "#") continue; // 230630 hjkim - 주석처리 패싱
            var rows_row          = rows[i].split(DELIM);
            this.trim_all(rows_row);
            var json_row         = {};
            for (var j = 0; j < header.length; j += 1) {
                if (rows_row[j] == "")
                continue;
                // console.log("!@#$ TIME_COLUMN:", TIME_COLUMN);
                switch (_CSV_TYPE_) {
                    case "RAW_DATA":
                    if (j == TIME_COLUMN && TIME_COLUMN > -1) {
                        rows_row[j] = this.datestr_to_unixtime(rows_row[j - 1], rows_row[j]);
                    }
                    break;
                    case "EVENT_DATA":
                    if (0 <= j && j < 2) {
                        // console.log("!@#$ EVENT_DATA/ rows_row[j] :", rows_row[j]);
                        rows_row[j] = new Date(rows_row[j]).getTime().toString();
                    }
                    break;
                    default:
                    if (j == TIME_COLUMN && TIME_COLUMN > -1) {
                        rows_row[j] = this.datestr_to_unixtime(rows_row[j - 1], rows_row[j]);
                    }
                    break;
                }
                json_row[header[j]] = rows_row[j];
                }
            json.push(json_row);
        }
        return json;
    };
    // >>> 240625 hjkim - add graph marking
    Interface.DataPreprocessing = DataPreprocessing;
    Interface.set_csv_type = (type) => _CSV_TYPE_ = type;
    // <<< 240625 hjkim - add graph marking

    // $FlowFixMe
    DataPreprocessing.parse_tsv = function (text) {
        return this.parse_xsv(text, "\t");
    };
    // $FlowFixMe
    DataPreprocessing.parse_csv_event = function (text) {
        return this.parse_xsv(text, ",");
    }
    // $FlowFixMe
    DataPreprocessing.parse_csv = function (text) {
        return this.parse_xsv(text, ",");
    };
    DataPreprocessing.trim_all = function (obj) {
        for (var i = 0; i < obj.length; i += 1) {
            obj[i] = obj[i].trim();
        }
    };
    DataPreprocessing.is_it_disallow = function (key) {
        // console.log("is it disallow : ", key);
        if (key.includes("blank"))
        return true;
        // if(key.includes("P_A_B_in")) return true;
        if (key.includes("Power"))
        return true;
        return false;
    };
    DataPreprocessing.datestr_to_unixtime = function (date, time) {
        if (date == null || date == undefined)
        throw "datestr_to_unixtime() arg1 is null.";
        if (time == null || time == undefined)
        throw "datestr_to_unixtime() arg2 is null.";
        var unixtime = 0;
        var datestr = date.replaceAll("-", "/");
        datestr += " ";
        datestr += time.replaceAll("-", ":");
        // console.log("datestr : ", datestr);
        unixtime = new Date(datestr).getTime();
        return unixtime;
    };
    DataPreprocessing.prev_t;
    // $FlowFixMe
    DataPreprocessing.json_to_flotdata = function (arr) {
        var flotdata = [];
        var header = Object.keys(arr[0]);
        for (var i = 2; i < header.length; i += 1) {
            var k = header[i];
            // $FlowFixMe
            if (!this.is_in_filter(k)) continue;
            // $FlowFixMe
            if (this.is_it_disallow(k)) continue;
            // series : { label : "sth", data : [ [x,y], ...]}
            // series : { label : "sth", data : [ [x,y], ...], yaxis: 2}
            // series : { label : "sth", data : [ [x,y], ...], yaxis: 2, color: "#EFEFEF" }
            var series;
            // $FlowFixMe
            let _color = color_palette[i];
            if (_includes(k, "kPa")) {
                series = { label: k, data: [], color: _color, yaxis: 2 };
            } else {
                series = { label: k, data: [], color: _color };
            }
            for (var j = 0; j < arr.length; j += 1) {
                var t;
                if (isNaN(arr[j]["Time"])) {
                    if (j == 0) { t = new Date().getTime(); }
                    // $FlowFixMe
                    else { t = (this.prev_t + 1); }
                    series.data.push([t, arr[j][k]]);
                    // $FlowFixMe
                    this.prev_t = t;
                } else series.data.push([arr[j]["Time"], arr[j][k]]);
            }
            flotdata.push(series);
        }
        return flotdata;
    };     
    // $FlowFixMe
    DataPreprocessing.is_in_filter = function (key) {
        if (this.g_filter_arr == null) return true;
        if (this.g_filter_arr.length == 0) return true;
        var is_true = false;
        for (var i = 0; i < this.g_filter_arr.length; i++) {
            if (key.includes(this.g_filter_arr[i]))
            return true;
        }
        return is_true;
    };
    /* -------------------------------------------------------------------------- */
    /*                                  FUNCTION SET                              */
    /* -------------------------------------------------------------------------- */
    // >>>>>>> 230531 hjkim - 파일 캐시 요청
    var _IS_CACHE_WORK = false;
    function _cache_work(xhr, data_url) {
        // >>> 240119 hjkim - 아차피 포팅 작업
        if(_IS_CACHE_WORK == false) return;
        // <<< 240119 hjkim - 아차피 포팅 작업
        xhr.setRequestHeader("Cache-Control", "public, max-age=86400");
        var agent = window.navigator.userAgent.toLowerCase();
        if (agent.indexOf("chrome") > -1 && !!window.chrome) { // 크롬일 경우에만 파일 캐시 요청
            if (localStorage.getItem(data_url)) {
                var cached_date = localStorage.getItem(data_url);
                if(cached_date == null) { console.error("캐쉬된 데이터가 없습니다."); return; }
                xhr.setRequestHeader("If-Modified-Since", cached_date);
            }
        }
    }
    // <<<<<<< 230531 hjkim - 파일 캐시 요청     
    function reload_graph(e, cb_done) {
        // CLEAR
        if(g_graph_inst != null) g_graph_inst.destroy();
        // g_subgraph_inst.destroy();
        // $FlowFixMe
        $(g_el.graph).off("plotclick").off("plotselected").off("plothover");
        // $FlowFixMe
        $(g_el.subgraph).off("plotclick").off("plotselected").off("plothover");
        // INIT
        // g_data_url = `${BASE_DATA_URI}/${g_el.yearly.value}/${g_el.monthly.value}/${g_el.daily.value}/${g_el.timely.value};reqtime=${new Date().getTime()}`;
        if(g_el.yearly == null) { console.error("yearly 요소가 없습니다."); return; }
        if(g_el.monthly == null) { console.error("monthly 요소가 없습니다."); return; }
        if(g_el.daily == null) { console.error("daily 요소가 없습니다."); return; }
        if(g_el.timely == null) { console.error("timely 요소가 없습니다."); return; }
        window.g_data_url = `${BASE_DATA_URI()}/${g_el.yearly.value}/${g_el.monthly.value}/${g_el.daily.value}/${g_el.timely.value}`;
        // >>> 241010 hjkim - 이벤트 경로 수정
        let _t = new Date();
        let _ymd = [_t.getFullYear(), (_t.getMonth()+1), _t.getDate()];
        get_data(window.g_data_url, window.g_event_url(_ymd[0], _ymd[1], _ymd[2], STACK_NAME()), cb_done);
        // <<< 241010 hjkim - 이벤트 경로 수정
        // SUBGRAPH PART
        try {
            // $FlowFixMe
            BarcodeChart.IBarcode_chart_done();
            // $FlowFixMe
            BarcodeChart.IBarcode_chart_init(g_impedentce_uri_list);    
        } catch (error) {
            console.error("BarcordChart js가 로딩되지 않았습니다.");
        }
    }
    Interface.reload_graph = reload_graph;    
})(TimeSeriesPlot);
    
function zero_pad(n) { return (n < 10) ? "0" + n : n; }
const IMPEDANCE_LIST = "/ALL/data/impedance/imp_data/";
var g_impedentce_uri_list = []; // 임피던스 이미지 데이터로 서브 그래프 툴팁에서 사용

function _compose_url_ymd(y_el, m_el, d_el, t_el) {
    if(y_el == null) { throw "yearly 요소가 없습니다."; }
    if(m_el == null) { throw "monthly 요소가 없습니다."; }
    if(d_el == null) { throw "daily 요소가 없습니다."; }
    if(t_el == null) { throw "timely 요소가 없습니다."; }
    // $FlowFixMe
    return `${BASE_DATA_URI()}/${y_el.value}/${m_el.value}${d_el.value}${t_el.value}`;
}
    
/* -------------------------------------------------------------------------- */
/*                                  CALENDEX                                  */
/* -------------------------------------------------------------------------- */
var Calendex = {
    backtracking_cnt: 0, // 퇴각 검색 카운터로 콜백함수의 동작의 분기 제어
    _fn_init_graph: null,
    // >>> 231201 hjkim - default calendex
    init_el: (_el) => {
        
        if(g_el.yearly == null) { // 캘린덱스가 없을 경우 생성
            var xml_str = `
            <div style="position: relative; margin-bottom: 20px">
            <div class="btn-wrapper" style="position: absolute; right:0; z-index: 1; padding: 4px">
            <button ontouchstart="zoom_in()" onclick="zoom_in()" class="btn-of mid-size w50px ">
            <span class="icon-zoom-in"></span>
            </button>
            <button ontouchstart="zoom_out()" onclick="zoom_out()" class="btn-of mid-size w50px">
            <span class="icon-zoom-out"></span>
            </button>
            <select id="yearly">
            <option value=-1 disabled>-년 선택-</option>
            </select>
            <select id="monthly">
            <option value=-1 disabled>-월 선택-</option>
            </select>
            <select id="daily">
            <option value=-1 disabled>-일 선택-</option>
            </select>
            <select id="timely">
            <option value=-1 disabled>-시 선택-</option>
            </select>
            </div>
            </div>
            `;
            var doc = new DOMParser().parseFromString(xml_str, "text/xml");
            _el.parentElement.innerHTML = xml_str + _el.parentElement.innerHTML;
        }
        g_el.yearly  = document.querySelector("#yearly");
        g_el.monthly = document.querySelector("#monthly");
        g_el.daily   = document.querySelector("#daily");
        g_el.timely  = document.querySelector("#timely");

        // >>> 241016 reset_calendex의 timeout을 retry로 수정하기 위해 blocking 처리
        g_el.yearly_handler = (e) => {
            console.log("!@#$ yearly_handler");
            var _url = `${BASE_DATA_URI()}/${e.target.value}`;
            _url = _url.replaceAll("//", "/");
            g_el.yearly.disabled = true;
            console.log("!@#$ yearly_handler / _url : ", _url);
            channel3.port2.postMessage({msg: "CH3/(1)GET_DIR", url: _url, response:"CH3/(a)MONTHLY_LIST"});
        };
        g_el.monthly_handler = (e) => {
            console.log("!@#$ monthly_handler");
            var _url = `${BASE_DATA_URI()}/${g_el.yearly.value}/${e.target.value}`;
            _url = _url.replaceAll("//", "/");
            g_el.monthly.disabled = true;
            console.log("!@#$ monthly_handler / _url : ", _url);
            channel3.port2.postMessage({msg: "CH3/(1)GET_DIR", url: _url, response:"CH3/(b)DAILY_LIST"});
        };
        g_el.daily_handler = (e) => {
            console.log("!@#$ daily_handler");
            var _url = `${BASE_DATA_URI()}/${g_el.yearly.value}/${g_el.monthly.value}/${e.target.value}`;
            _url = _url.replaceAll("//", "/");
            g_el.daily.disabled = true;
            console.log("!@#$ daily_handler / _url : ", _url);
            channel3.port2.postMessage({msg: "CH3/(1)GET_DIR", url: _url, response:"CH3/(c)TIMELY_LIST"});
        };
        g_el.timely_handler = (e) => {
            console.log("!@#$ timeily_handler");
            save_calendex_state();
            var _url = `${BASE_DATA_URI()}/${g_el.yearly.value}/${g_el.monthly.value}/${g_el.daily.value}/${e.target.value}`;
            _url = _url.replaceAll("//", "/");
            window.g_data_url = _url; // 전역변수에 저장
            console.log("!@#$ timeily_handler / _url : ", _url);

            // >>> 240827 hjkim - 그래프 이벤트 핸들러 detach
            $(g_el.graph).off("plotclick").off("plotselected").off("plothover");
            // >>> 240827 hjkim - 그래프 이벤트 핸들러 detach

            // 240729 >>> hjkim - 대시보드 / BOP진단 둘 다 호출됨
            if(is_title("BOP진단")) {
                let wsize = document.querySelector("#wsize").value;
                channel1.port2.postMessage({
                    msg: "CH1/(4)BOP_DATA_FETCH", 
                    url: _url, 
                    imp_url: "/ALL/data/impedance/imp_data/", 
                    window_size: parseInt(wsize),
                    debug: "L1850"
                });
            } else {
                channel1.port2.postMessage({
                    msg: "CH1/(4)BOP_DATA_FETCH", 
                    url: _url, 
                    imp_url: "/ALL/data/impedance/imp_data/", 
                    window_size: -1,
                    is_result : true,
                    debug: "L1866" 
                });
            }
            // 240729 <<< hjkim - 대시보드 / BOP진단 둘 다 호출됨
        };
        // <<< 241016 reset_calendex의 timeout을 retry로 수정하기 위해 blocking 처리
        
        // if(g_el.yearly == null) throw "yearly 요소가 없습니다.";
        // g_el.yearly.innerHTML = "<option value=-1 disabled>-년 선택-</option>";
        // if(g_el.monthly == null) { throw "monthly 요소가 없습니다."; }
        // g_el.monthly.innerHTML  = "<option value=-1 disabled>-월 선택-</option>";
        // if(g_el.daily == null) { throw "daily 요소가 없습니다."; }
        // g_el.daily.innerHTML    = "<option value=-1 disabled>-일 선택-</option>";
        // if(g_el.timely == null) { throw "timely 요소가 없습니다."; }
        // g_el.timely.innerHTML   = "<option value=-1 disabled>-시 선택-</option>";
        Calendex.enroll_eventhandler( g_el.yearly_handler, 
            g_el.monthly_handler, g_el.daily_handler, g_el.timely_handler);

        // main.js <--> data.js 통신
        channel3.port2.onmessage = (e) => {
            switch(e.data.msg) {
                case "CH3/(a)MONTHLY_LIST":
                    Calendex.refresh_monthly(e.data.list);
                    Calendex.refresh_daily([]);
                    Calendex.refresh_timely([]);
                    g_el.yearly.disabled = false;
                break;
                case "CH3/(b)DAILY_LIST":
                    Calendex.refresh_daily(e.data.list);
                    Calendex.refresh_timely([]);
                    g_el.monthly.disabled = false;
                break;
                case "CH3/(c)TIMELY_LIST":
                    Calendex.refresh_timely(e.data.list);
                    g_el.timely.selectedIndex = 1;
                    var event = new Event('change');
                    g_el.timely.dispatchEvent(event);
                    g_el.daily.disabled = false;
                break;
            }
        }
    },
    // <<< 231201 hjkim - default calendex
    enroll_eventhandler: (_y_handler, _m_handler, _d_handler, _t_handler) => {
        if(_y_handler == undefined) { console.error("!@#$ 등록할 yearly 핸들러가 없습니다."); return; }
        if(_m_handler == undefined) { console.error("!@#$ 등록할 monthly 핸들러가 없습니다."); return; }
        if(_d_handler == undefined) { console.error("!@#$ 등록할 daily 핸들러가 없습니다."); return; }
        if(_t_handler == undefined) { console.error("!@#$ 등록할 timely 핸들러가 없습니다."); return; }

        var CALENDEX_COOKIE_EXPIRE = 30;
        // >>> Date Picker Change 이벤트 핸들러
        if(g_el.yearly == null) { console.error("!@#$ yearly 가 없습니다.");}
        else { g_el.yearly.addEventListener("change", _y_handler); }
        if(g_el.monthly == null) { console.error("!@#$ monthly 가 없습니다.");}
        else { g_el.monthly.addEventListener("change", _m_handler); }
        if(g_el.daily == null) { console.error("!@#$ daily 가 없습니다.");}
        else { g_el.daily.addEventListener("change", _d_handler); }
        if(g_el.timely == null) { console.error("!@#$ timely 가 없습니다.");}
        else { g_el.timely.addEventListener("change", _t_handler); }
        // <<< Date Picker Change 이벤트 핸들러
    },
    enroll_callback: (fn_init_graph) => {
        if(fn_init_graph != null) { Calendex._fn_init_graph = fn_init_graph; }
    },
    init_calendex : (fn_init_graph) => {
        
        // >>> 240108 hjkim - 선택된 항목 쿠키에서 읽기
        var d = new Date();
        var yyyy = (get_cookie("calendex_yearly") != null) ? get_cookie("calendex_yearly") : d.getFullYear();
        var mm      = zero_pad((d.getMonth() * 1 + 1));
        var dd      = zero_pad(d.getDate());
        // <<< 240108 hjkim - 선택된 항목 쿠키에서 읽기
        
        // 파일목록 추출
        if(g_el.yearly == null) { throw "yearly 요소가 없습니다."; }
        // $FlowFixMe
        // g_el.yearly.value = "" + yyyy;
        // Calendex.refresh_monthly({}, function (last_item) {
        //     // >>> 240108 hjkim - 선택된 항목 쿠키에서 읽기
        //     last_item = (get_cookie("calendex_monthly") != null) ? get_cookie("calendex_monthly") : last_item;
        //     // <<< 240108 hjkim - 선택된 항목 쿠키에서 읽기
            
        //     if (fn_init_graph) { 
        //         if(g_el.monthly == null) { throw "monthly 요소가 없습니다."; }
        //         // $FlowFixMe
        //         g_el.monthly.value = last_item; 
        //         Calendex.refresh_daily({}, fn_refresh_timely_cb); 
        //     }
        // }, Calendex.refresh_monthly, arguments.callee);
        
        // 일간 선택의 콜백함수로 arguments.callee를 쓰려면 익명함수를 쓸 수 없다.
        function fn_refresh_timely_cb(last_item) {
            // >>> 240108 hjkim - 선택된 항목 쿠키에서 읽기
            last_item = (get_cookie("calendex_daily") != null) ? get_cookie("calendex_daily") : last_item;
            // <<< 240108 hjkim - 선택된 항목 쿠키에서 읽기
            if(g_el.daily == null) { throw "daily 요소가 없습니다."; }
            // $FlowFixMe
            g_el.daily.value = last_item;
            // 시 선택 갱신
            Calendex.refresh_timely({}, function (last_item) {
                // CSV / JPG 분류
                if(g_el.yearly == null) { throw "yearly 요소가 없습니다."; }
                if(g_el.monthly == null) { throw "monthly 요소가 없습니다."; }
                if(g_el.daily == null) { throw "daily 요소가 없습니다."; }
                if(g_el.timely == null) { throw "timely 요소가 없습니다."; }
                // $FlowFixMe
                g_el.timely.value = last_item;
                // $FlowFixMe
                window.g_data_url = `${BASE_DATA_URI()}/${g_el.yearly.value}/${g_el.monthly.value}/${g_el.daily.value}/${g_el.timely.value}`;
                
                if (g_graph_inst) { TimeSeriesPlot.reload_graph({ target: g_el.timely }); } /* 그래프가 있으면 그래프 갱신 */
                else {
                    if(fn_init_graph == null) throw "fn_init_graph 가 없습니다.";
                    fn_init_graph(); /* 그래프가 없으면 그래프 초기화 함수 콜백 */
                }
            }, 
            Calendex.refresh_daily, /* 퇴각검색을 위한 콜백함수 */
            arguments.callee /* 퇴각검색을 위한 콜백파라미터 */);
        }
    },
    refresh_yearly: (url_list) => {
        if(g_el.yearly == null) { throw "yearly 요소가 없습니다."; }
        g_el.yearly.innerHTML = `<option value=-1 selected>-월(${(url_list.length)}개)-</option>`;
        url_list.map(_value => {
            if(g_el.yearly == null) { throw "yearly 요소가 없습니다."; }
            g_el.yearly.innerHTML += `<option value="${_value}" >${_value}</option>`; 
        });
    },
    refresh_monthly: (url_list) => {
        if(g_el.monthly == null) { throw "monthly 요소가 없습니다."; }
        g_el.monthly.innerHTML = `<option value=-1 selected>-월(${(url_list.length)}개)-</option>`;
        url_list.map(_value => {
            if(g_el.monthly == null) { throw "monthly 요소가 없습니다."; }
            g_el.monthly.innerHTML += `<option value="${_value}" >${_value}</option>`; 
        });
    },
    refresh_daily: (url_list) => {
        if(g_el.daily == null) { throw "daily 요소가 없습니다."; }
        g_el.daily.innerHTML = `<option value=-1 selected>-일(${(url_list.length)}개)-</option>`;
        url_list.map(_value => {
            if(_value == null) { throw "_value 값이 없습니다."; }
            g_el.daily.innerHTML += `<option value="${_value}" >${_value}</option>`;
        });
    },
    refresh_timely: (url_list) => {
        if(g_el.timely == null) { throw "timely 요소가 없습니다."; }
        g_el.timely.innerHTML = `<option value=-1 selected>-시(${(url_list.length)}개)-</option>`;
        url_list.map(_value => {
            if(_value == null) { throw "_value 값이 없습니다."; }
            g_el.timely.innerHTML += `<option value="${_value}" >${_value}</option>`;
        });
    }
};

/* =======================================================*/
/*                      FUNCTION SET                      */
/*========================================================*/
// >>> 240108 hjkim - 선택된 항목 쿠키에 저장
function set_cookie(name, value, days_to_expire) {
    var expiration_date = new Date();
    expiration_date.setDate(expiration_date.getDate() + days_to_expire);
    var cookie_str = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expiration_date.toUTCString()}; path=/`;
    document.cookie = cookie_str;
}

function get_cookie(name) {
    name += "=";
    var decoded_cookie = decodeURIComponent(document.cookie);
    var cookie_arr = decoded_cookie.split(";");
    for(var i = 0; i < cookie_arr.length; i++) {
        var cookie = cookie_arr[i].trim();
        if(cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}
// <<< 240108 hjkim - 선택된 항목 쿠키에 저장
// >>> 241129 hjkim - 클리어 Calendex 쿠키 버그 수정
function delete_cookie(name, path = '/') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}

function clear_calendex_cookie() {
    delete_cookie("FDC_calendex_yearly");
    delete_cookie("FDC_calendex_monthly");
    delete_cookie("FDC_calendex_daily");
    delete_cookie("FDC_calendex_timely");
}
// >>> 241129 hjkim - 클리어 Calendex 쿠키 버그 수정
function access(uri, cb) {
    try {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    return cb(true, uri, xhr.responseText);
                } else {
                    return cb(false, uri);
                }
            } else {}
        };
        xhr.onerror = function () {
            return cb(false, uri);
        };
        xhr.open("GET", uri, true);
        xhr.send();
    }
    catch (e) {
        return cb(false, uri);
    }
}

var _IS_APACHE_SERVER = true;
function extract_uri_list(html) {
    if(_IS_APACHE_SERVER) {
        return extract_uri_list_apache(html);
    } else {
        return extract_uri_list_org(html);
    }
}

function extract_uri_list_apache(html) {
    var uri_list = [];
    var dom = new DOMParser().parseFromString(html, "text/html");
    var a_el = dom.querySelectorAll("td a");
    for (var i = 0; i < a_el.length; i++) {
        // console.log(a_el[i]);
        // console.log(a_el[i].getAttribute("href"));
        // console.log(li_el[i].innerHTML);
        var _uri = a_el[i].getAttribute("href");
        if(_uri != null && _uri.indexOf("%") > 0) _uri = decodeURIComponent(_uri);
        uri_list.push(_uri);
    }
    return uri_list;
}

function extract_uri_list_org(html) {
    var uri_list = [];
    var lines = html.split('\n');
    lines.splice(0, 1);
    html = lines.join('\n');
    var dom = new DOMParser().parseFromString(html, "text/xml");
    var a_el = dom.querySelectorAll("li a");
    for (var i = 0; i < a_el.length; i++) {
        // console.log(a_el[i]);
        // console.log(a_el[i].getAttribute("href"));
        // console.log(li_el[i].innerHTML);
        uri_list.push(a_el[i].getAttribute("href"));
    }
    return uri_list;
}

function refresh_legend(e) {
    var text_el;
    var i;
    if (e != null) { // 메뉴 상단에서 범례 그룹으로 갱신할 경우,
        var v = e.target.value.split(",");
        // 그래프 라벨 토글
        // - 모두 끔
        line_all_off();
        toggle_all_off_legend();
        // - 원하는 것만 켬
        var arr = get_sensor(v[0], v[1]);
        if (v[0] == 0) {
            // 전체 범례 ON
            line_all_on();
            toggle_all_on_legend();
        }
        else {
            // 부분 범례 ON
            text_el = document.querySelectorAll(".legend_text");
            for (var j = 0; j < text_el.length; j += 1) { // 범례 루프
                if(arr == null) throw "arr 값이 없습니다.";
                for (i = 0; i < arr.length; i += 1) { // 범례 그룹 필터
                    if (text_el[j].getAttribute(DATA_LEGEND_LABEL) != null
                    // && text_el[j].getAttribute(DATA_LEGEND_LABEL).includes(arr[i])) { // 범례 매칭
                    &&arr[i] == null
                    && _includes(text_el[j].getAttribute(DATA_LEGEND_LABEL), arr[i])) { // 범례 매칭
                        toggle_flot_by_label(text_el[j].getAttribute(DATA_LEGEND_LABEL)); // 범례 토글
                        
                        var target = text_el[j];
                        // 범례 체크
                        if (target.getAttribute(DATA_LEGEND_CHECKED) == "true") {
                            // target.style = "text-decoration:line-through; color: grey;";
                            target.style.textDecoration = "line-through";
                            target.style.color = "grey";
                            target.setAttribute(DATA_LEGEND_CHECKED, "false");
                        } else {
                            // target.style = "text-decoration:none;";
                            target.style.textDecoration = "none";
                            target.setAttribute(DATA_LEGEND_CHECKED, "true");
                        }
                        break;
                    }
                }
            }
        }
    } else { // 그래프 갱신 후 범례를 갱신할 경우,
        // 선택된 범례만 갱신
        line_all_off();
        // 부분 범례 ON
        text_el = document.querySelectorAll(".legend_text[" + DATA_LEGEND_CHECKED + "='true']");
        for (i = 0; i < text_el.length; i += 1) { // 범례 루프
            if (text_el[i].getAttribute(DATA_LEGEND_LABEL) != null) { // 범례 매칭
                toggle_flot_by_label(text_el[i].getAttribute(DATA_LEGEND_LABEL)); // 범례 토글
            }
        }
        
        // 하이라이트된 범례만 갱신
        if (!DATA_LEGEND_HIGHLIGHTED) return;
        var elms = document.querySelectorAll("td [" + DATA_LEGEND_HIGHLIGHTED + "='true']");
        for (i = 0; i < elms.length; i++) {
            // 범례 하이라이트
            TimeSeriesPlot.toggle_highlight_line_by_label(elms[i].getAttribute(DATA_LEGEND_LABEL));
        }
    }
}    
    
function IRefresh_Legend(value) {
    var e = { target: { value: "" } };
    switch (value) {
        case "STK":
        e.target.value = "1,0";
        break;
        case "FUE":
        case "UNK":
        e.target.value = "6,0";
        break;
        case "THM":
        e.target.value = "5,0";
        break;
        case "WTR":
        e.target.value = "4,0";
        break;
        case "AIR":
        e.target.value = "3,0";
        break;
        default:
        case "NOR":
        e.target.value = "0,0";
        break;
    }
    // $FlowFixMe
    g_el.sel_label_group.value = e.target.value;
    refresh_legend(e);
}

function line_all_off() {
    var d = g_graph_inst.getData();
    for (var idx = 0; idx < d.length; idx++) {
        d[idx].lines.show = false;
    }
    g_graph_inst.draw();
}

function toggle_all_off_legend() {
    var text_el = document.querySelectorAll(".legend_text");
    for (var i = 0; i < text_el.length; i += 1) {
        toggle_off_legend(text_el[i]);
    }
}

function toggle_off_legend(element) {
    element.style = "text-decoration:line-through; color: grey;";
    element.setAttribute(DATA_LEGEND_CHECKED, "false");
}

function get_sensor(s, c) {
    var map_to_sensor = [
        [],
        ["Current", "Voltage", "T_DI_h_out", "T_DI_S_out"],
        [],
        // 3,0~5: 공기공급계
        //["Voltage", "Current", //에기연 공기 변수
        //"T_A_B_in", "P_A_B_in", "P_A_m_out", "T_A_m_out", "MFM1","Air"], //에기연 공기 변수
        ["P_A_S_in", "P_A_m_out", "Air"],
        // 4,0~2: 물관리계
        //["T_A_S_out", "T_A_m_out", "T_A_S_in", "T_A_vent"], //에기연 물 변수
        ["T_A_S_out", "T_A_S_in", "T_A_vent"],
        // 5,0~12: 열관리계
        //["Voltage", "Current", "T_w_h_out", "T_w_h_in", "T_DI_h_out", "T_DI_S_out", "T_DI_S_in", "T_w_t_out", //에기연 열 변수
        //"MFM3", "MFM2", "DI_Pump(%)", "Water_Pump(%)" , "DI" , "Water"], //에기연 열 변수
        ["T_w_h_out", "T_DI_S_in", "T_A_S_out", "DI_Pump(%)", "MFM2(DI)", "DI(%)", "Water"],
        // 6,0
        //["Voltage", "Currnt"],
        ["Voltage", "Current", "P_A_S_in", "P_A_m_out", "Air", "T_A_S_out", "T_A_S_in", "T_A_vent", "T_w_h_out", "T_DI_S_in", "DI_Pump(%)", "MFM2(DI", "DI(%)", "Water", "P_A_S_in"],
    ];
    if (0 < s && c == 0) return map_to_sensor[s];
    if (0 < s && 0 < c) return [map_to_sensor[s][c]];
}

function _includes(str, niddle) {
    return str.indexOf(niddle) !== -1;
}    
    
function str_diff(a, b) {
    a = a.toLowerCase(); 
    b = b.toLowerCase();
    var diff = 0;
    var len = a.length < b.length ? a.length : b.length;
    for(var i = 0; i < len; i++){
        // diff += Math.abs(a.charCodeAt(i) - b.charCodeAt(i));
        if(a.charCodeAt(i) != b.charCodeAt(i)) diff++;
    }
    return diff;
}

function toggle_flot_by_label(label) {
    var d = g_graph_inst.getData();
    for (var idx = 0; idx < d.length; idx++) {
        if (d[idx].label.includes(label)) {
            d[idx].lines.show = !d[idx].lines.show;
        }
    }
    g_graph_inst.draw();
}

function line_all_on() {
    var d = g_graph_inst.getData();
    for (var idx = 0; idx < d.length; idx++) {
        d[idx].lines.show = true;
    }
    g_graph_inst.draw();
}

function toggle_all_on_legend() {
    var text_el = document.querySelectorAll(".legend_text");
    for (var i = 0; i < text_el.length; i += 1) {
        toggle_on_legend(text_el[i]);
    }
}

function toggle_on_legend(element) {
    element.style = "text-decoration:none; background-color: yellow;";
    element.setAttribute(DATA_LEGEND_CHECKED, "true");
}    
    
/* 
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 소프트센서 / BOP 진단결과                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

/* 
* .소프트센서
*   .소프트센서 그래프
*       @requirement {XHR1} /ALL/data/yyyy/mm/dd/*_ma_softsensor.csv 질의결과
*       @param  json
*       @description    소프트센서 그래프는 SoftSensor.Init_sw_sensor_graph()로 트리거 되며 파라미터를 1개 넘겨 받는다.
*       json은 /ALL/data/yyyy/mm/dd/*.csv 중 MA가 처리된 MA데이터이다.
*
*   .스택 바차트
*       @requirement /ALL/data/impedance/imp_data/ 질의결과
*       @requirement {XHR1} /ALL/data/yyyy/mm/dd/*.csv 질의결과 
*       @param  g_impedentce_uri_list
*       @param  stimestamp
*       @parma  etimestamp
*       @description   스택 바차트는 SoftSensor.Init_stack_barchart()로 트리거 되며 파라미터를 3개 넘겨 받는다. 
*       g_impedentce_uri_list는 /ALL/data/impedance/imp_data/의 파일목록으로부터 필요한 정보를 얻어오므로
*       임피던스 측정 기록에 대한 파일명이 필수이다. stimestamp와 etimestamp는 g_graph_data로부터 얻어 오는데
*       /ALL/data/yyyy/mm/dd/*.csv의 첫번째 시각과 마지막 시각이 그 출처이다.
*
*   .BOP 바차트
*       @requirement {XHR1} /ALL/data/yyyy/mm/dd/*.csv 질의결과
*       @param  json
*       @description   BOP 바차트는 SoftSensor.Init_bop_barchart()로 트리거 되며 파라미터를 1개 넘겨 받는다.
*       json은 /ALL/data/yyyy/mm/dd/*.csv의 csv로부터 JSON을 도출하고 해당 JSON을 변환하여 Flot입력을 위한
*       JSON으로 변환한 것이다.
*   .
*/   

// >>> 240105 hjkim =======================소프트 센서 / BOP 진단결과 ==========================
var SoftSensor = {
    // >>> 240226 hjkim - Redirect to stack.html
    impedance_url: "",
    // <<< 240226 hjkim - Redirect to stack.html
    Init_sw_sensor_graph: (_data) => {
        // 이미지 태그 삭제
        var _img_el = document.querySelector(".widget.soft-senser-monitoring .widget-body img");
        var _sw_el = document.querySelector(".widget.soft-senser-monitoring .widget-body .sw_sensor_graph");
        if(_sw_el) { _sw_el.remove(); }
        if(_img_el) { _img_el.remove(); }
        // 그래프 그리k
        var _placeholder_el = document.querySelector(".widget.soft-senser-monitoring .widget-body");
        
        // >>> 240223 hjkim - 툴팁 오버플로우 문제
        var _overflow_el = document.querySelector(".widget.soft-senser-monitoring");
        _overflow_el.style.overflow = "visible";
        // <<< 240223 hjkim - 툴팁 오버플로우 문제
        
        var _div_el = document.createElement("div");
        _div_el.className = "sw_sensor_graph";
        
        // >>> 240227 hjkim - 날짜 컨트롤러 이동
        _div_el.style = `height: ${_overflow_el.clientHeight-100}px;`;
        let _before_el = document.querySelector(".widget.soft-senser-monitoring .widget-body .result"); 
        _placeholder_el.insertBefore(_div_el, _before_el);
        // <<< 240227 hjkim - 날짜 컨트롤러 이동
        
        var _opt = g_FlotOption.init_line_opt(_data);
        _opt.yaxes[0].max = 20;
        _opt.yaxes[0].min = -10;
        // >>> 240305 hjkim - Change y-axis label on softsensor.
        _opt.yaxes[0].tickFormatter = (v, axis) => (v*1).toFixed(axis.tickDecimals);
        // <<< 240305 hjkim - Change y-axis label on softsensor.
        // >>> 240625 hjkim - add graph marking
        TimeSeriesPlot.set_csv_type("EVENT_DATA");
		
        // >>> 241010 hjkim - 이벤트 경로 수정
        
        // >>> 241104 hjkim - BOP 메뉴 회색 마커가 안나오는 버그 수정
        const G_APPLYING_COND = `window.g_applying_calendex_state == false`;
        const G_YEARLY_COND   = `g_el.yearly.value != '' && g_el.yearly.value != '-1'`;
        const G_MONTHLY_COND  = `g_el.monthly.value != '' && g_el.monthly.value != '-1'`;
        const G_DAILY_COND    = `g_el.daily.value != '' && g_el.daily.value != '-1'`;
        const __COND = `${G_APPLYING_COND} && ${G_YEARLY_COND} && ${G_MONTHLY_COND} && ${G_DAILY_COND}`;
        // console.log("!@#$ L2425 __COND : ", __COND);
        retry(__COND, 10, 10, () => { get_event_data(); } );
        // >>> 241104 hjkim - BOP 메뉴 회색 마커가 안나오는 버그 수정
        function get_event_data() {
            fetch( window.g_event_url(parseInt(g_el.yearly.value), parseInt(g_el.monthly.value), parseInt(g_el.daily.value), STACK_NAME()) )
            // <<< 241010 hjkim - 이벤트 경로 수정
            .then(d => d.text())
            // >>> 241011 hjkim - get_event.php 전처리 부분
            .then(data => {
                if(data.indexOf("0,") == 0 || data.indexOf("1,") == 0) {

                    // >>> 241101 hjkim - 스택바 차트 데이터 경로 수정
                    let data1 = window.data_classify(data, 1);
                    if(data1.length != 0) {
                        data1 = "sTime,eTime,Type,Amp,Memo\n"+data1;
                        data1 = TimeSeriesPlot.DataPreprocessing.parse_xsv(data1, ",")
                        let _stime = data1[0].sTime;
                        let _etime = data1[data1.length-1].eTime;
                        // console.log("!@#$ data1 : ", data1);
                        let _html = data1.reduce((acc_html, d, idx) => {
                            acc_html += SoftSensor.run_sth_for_stack2(d, (_etime-_stime), _stime);
                            return acc_html;
                        }, "");
                        // console.log("!@#$ _html : ", _html);
                        SoftSensor.done_sth_for_stack(_html);
                    }
                    // <<< 241101 hjkim - 스택바 차트 데이터 경로 수정

                    data = window.data_classify(data, 0);
                    data = "sTime,eTime,Type,Amp,Memo\n"+data;
                }
                return data;
            })
            // <<< 241011 hjkim - get_event.php 전처리 부분
            // .then(debug => {console.log("!@#$ L2380", debug); return debug; })
            .then(txt => TimeSeriesPlot.DataPreprocessing.parse_xsv(txt, ","))
            // .then(debug => {console.log("!@#$ L2381", debug); return debug; })
            .then(event_json => {
                _opt = TimeSeriesPlot.init_mark_opt(_opt, _data, event_json);
                g_graph_soft = $.plot(_div_el, _data, _opt);
            });
            // <<< 240625 hjkim - add graph marking
        }
        // setInterval(get_event_data, 3000);
    },

    refresh_softsensor_graph: () => {
        const year = parseInt(g_el.yearly.value);
        const month = parseInt(g_el.monthly.value);
        const day = parseInt(g_el.daily.value);
        const stack = STACK_NAME();

        fetch(window.g_event_url(year, month, day, stack))
            .then(d => d.text())
            .then(data => {
                if (data.startsWith("0,") || data.startsWith("1,")) {
                    let data1 = window.data_classify(data, 1);
                    if (data1.length !== 0) {
                        data1 = "sTime,eTime,Type,Amp,Memo\n" + data1;
                        data1 = TimeSeriesPlot.DataPreprocessing.parse_xsv(data1, ",");
                        const _stime = data1[0].sTime;
                        const _etime = data1[data1.length - 1].eTime;
                        const _html = data1.reduce((acc, d) => acc + SoftSensor.run_sth_for_stack2(d, _etime - _stime, _stime), "");
                        SoftSensor.done_sth_for_stack(_html);
                    }

                    data = window.data_classify(data, 0);
                    data = "sTime,eTime,Type,Amp,Memo\n" + data;
                }
                return data;
            })
            .then(txt => TimeSeriesPlot.DataPreprocessing.parse_xsv(txt, ","))
            .then(event_json => {
                const _opt = TimeSeriesPlot.init_mark_opt(g_graph_soft.getOptions(), g_graph_soft.getData(), event_json);
                g_graph_soft.setData(g_graph_soft.getData());
                g_graph_soft.setupGrid();
                g_graph_soft.draw();
            });
    },
    // <<< 240117 hjkim - SW센서 그래프
    
    // >>> 240115 hjkim - 스택 측정 상태 바차트
    Init_stack_barchart: (_data                 , timestamp_s       , timestamp_e       ) => {
        // 스택 그래프 그리기
        SoftSensor.init_sth_for_stack();
        // >>> 240222 hjkim - stack bar 드로잉
        let _range = timestamp_e - timestamp_s;
        
        let _group_by_data = {};
        _data.map(d => {
            if(!_group_by_data[d.label]) _group_by_data[d.label] = [];
            _group_by_data[d.label].push(d);
        });
        //const html = _group_by_data[Object.keys(_group_by_data)[0]]
        const html = _data
        .reduce((acc_html, d, idx) => {
            acc_html += SoftSensor.run_sth_for_stack2(d, _range, timestamp_s)
            return acc_html;
        }, "");
        SoftSensor.done_sth_for_stack(html);
        // <<< 240222 hjkim - stack bar 드로잉
    },
    // <<< 240115 hjkim - 스택 측정 상태 바차트
    // >>> 240115 hjkim - BOP 진단 상태 바차트 @deprecated
    // Init_bop_barchart: (_data           ) => {
    //     // 진단 그래프 그리기
    //     SoftSensor.init_sth_for_bop_result();
    //     const html = _data.filter(d => d.label.indexOf("Result") == 0)
    //     .map(d => {
            
    //         var len = d.data.length;
    //         var stime = d.data[0][0], etime = d.data[len-1][0];
            
    //         // >>> 240228 hjkim - RUN LENGTH 알고리즘
    //         var time_flag = {};
    //         const WINDOW_SIZE = 30*60*1000;
    //         for(var i = 0; i < d.data.length; i++) {
    //             for(var j = 0; j < WINDOW_SIZE; j++) {
    //                 if(i+j >= d.data.length) break;
    //                 if( _get_group(d.data[i][1]) != _get_group(d.data[i+j][1]) ) {
    //                     time_flag[ d.data[i+j][0] ] = d.data[i+j][1];
    //                     i += j;
    //                     break;
    //                 }
    //             }
    //         }
    //         // <<< 240228 hjkim - RUN LENGTH 알고리즘 
            
    //         // HTML 생성
    //         return d.data.map(d => {
    //             return [d[0]/*timestamp*/, d[1]/*result*/, stime, etime];
    //         })
    //         .reduce((acc_html, d, idx) => {
    //             acc_html += SoftSensor.run_sth_for_bop_result( (d[0]-stime), d[1], (etime-stime), len, d, time_flag );
    //             return acc_html;
    //         }, "");
    //     });
    //     SoftSensor.done_sth_for_bop_result(html);
        
    //     function _get_group(n) {
    //         if(n == 0) return 1;
    //         else if(1 <= n && n < 6) return 2;
    //         else if(6 <= n && n < 9) return 3;
    //         else if(9 <= n && n < 15) return 4;
    //         else return 5;
    //     }
    // },
    // <<< 240115 hjkim - BOP 진단 상태 바차트
    
    /* 
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │     FUNCTION SET for stack                                                  │
    └─────────────────────────────────────────────────────────────────────────────┘
    */
    init_sth_for_stack: () => {
        if(g_el.stack_event == null) return;
        g_el.stack_event.innerHTML = "";
        // >>> 240223 hjkim - stack chart 드로잉
        if(g_el.barcode_graph == null) return;
        for(var i = 0; i < g_el.barcode_graph.length; i++) {
            g_el.barcode_graph[i].style.float = "left";
        }
        // <<< 240223 hjkim - stack chart 드로잉 
    },
    // @active from 241101
    run_sth_for_stack2: (_data, _total_range, _timestamp_s) => {
        if(g_el.stack_event == null) return;
        
        const STACK_CLASSNAME = "stack-bg-color";
        // >>> 240222 hjkim - stack bar 드로잉
        const TIME_PADDING = _data.eTime - _data.sTime;
        const s_ts = _data.sTime*1;
        const e_ts = _data.eTime*1;
        // console.log("main.js / _data.timestamp, _timestamp_s : ",  _data.timestamp, _timestamp_s);
        const _left_pos = (_data.sTime*1) - _timestamp_s;
        // <<< 240222 hjkim - stack bar 드로잉
        let s_date = new Date(s_ts);
        let e_date = new Date(e_ts);
        let s_hh = s_date.getHours();
        let e_hh = e_date.getHours();
        let s_mm = s_date.getMinutes();
        let e_mm = e_date.getMinutes();
        function zero_pad(n) { return (n < 10) ? "0" + n : n; }
        const s_time = `${zero_pad(s_hh)}:${zero_pad(s_mm)}`;
        const e_time = `${zero_pad(e_hh)}:${zero_pad(e_mm)}`;
        
        // >>> 241101 hjkim - 스택바 차트 데이터 경로 수정
        var msg = "";
        if(_data.label == undefined) {
            msg = `<br>(${_data.Memo}) 측정중...`;
        } else {
            msg = _data.label.split('_').join("<br>") + "<br>측정중...";
        }
        // <<< 241101 hjkim - 스택바 차트 데이터 경로 수정
        // >>> 240223 hjkim - stack 클릭 이벤트
        // console.log("main.js / _left_pos, _total_range : ", _left_pos, _total_range);
        // console.log("main.js / _left_pos : ", _left_pos/_total_range*100);
        
        // >>> 250213 hjkim - BOP 스택 이동 기능 
        var res = render_html(STACK_CLASSNAME, _left_pos/_total_range*100, (TIME_PADDING*2)/_total_range*100, `${s_time}~${e_time}`, msg, _data.url, _data.sTime*1);
        // <<< 250213 hjkim - BOP 스택 이동 기능 
        // <<< 240223 hjkim - stack 클릭 이벤트
        // >>> 240227 hjkim - 스택바의 최근 값 출력
        SoftSensor.impedance_url = _data.url; // last one
        // >>> 240227 hjkim - 스택바의 최근 값 출력
        return res;
        // >>> 250213 hjkim - BOP 스택 이동 기능 
        function render_html(_sth_class, _left_pos, _time_padding, _date_text, _msg, _url, _stime) {
        // <<< 250213 hjkim - BOP 스택 이동 기능 
            // console.log("main.js / _left_pos2 : ", _left_pos);
            /*
            <div class="line stack-bg-color" style="width: 3%;left: 12%">
            <span class="tooltip-box">
            <div class="tooltip-box-inner">
            <div class="date">10:45~10:50</div>
            <div class="text">Stack 측정</div>
            </div>
            </span>
            </div>
            */
            // >>> 240223 hjkim - stack 클릭 이벤트
            // return `
            // <div class="line ${_sth_class}" style="position:absolute; width:${_time_padding}%; left:${_left_pos}%;" onclick="SoftSensor.stack_click_handler('${_url}', event)">
            // <span class="tooltip-box">
            // <div class="tooltip-box-inner">
            // <div class="date">${_date_text}</div>
            // <div class="text">${_msg}</div>
            // </div>
            // </span>    
            // </div>`;
            // <<< 240223 hjkim - stack 클릭 이벤트 
            // >>> 250213 hjkim - BOP 스택 이동 기능 
            return `
            <div class="line ${_sth_class}" style="border:1px solid black; position:absolute; width:${_time_padding}%; left:${_left_pos}%;" onclick="SoftSensor.stack_click_handler('${_url}', event)" stime="${_stime}">
            <span class="tooltip-box">
            <div class="tooltip-box-inner">
            <div class="date">${_date_text}</div>
            <div class="text">${_msg}</div>
            </div>
            </span>    
            </div>`;
            // <<< 250213 hjkim - BOP 스택 이동 기능 
        }
        
    },
    // @deprecated since 241101
    run_sth_for_stack: (_data, _total_range, _timestamp_s) => {
        if(g_el.stack_event == null) return;
        
        const STACK_CLASSNAME = "stack-bg-color";
        // >>> 240222 hjkim - stack bar 드로잉
        const TIME_PADDING = 1000*60*15; // +-15min = 1h
        const s_ts = _data.timestamp - TIME_PADDING;
        const e_ts = _data.timestamp + TIME_PADDING;
        // console.log("main.js / _data.timestamp, _timestamp_s : ",  _data.timestamp, _timestamp_s);
        const _left_pos = (_data.timestamp - _timestamp_s) - TIME_PADDING;
        // <<< 240222 hjkim - stack bar 드로잉
        
        let s_date = new Date(s_ts);
        let e_date = new Date(e_ts);
        let s_hh = s_date.getHours();
        let e_hh = e_date.getHours();
        let s_mm = s_date.getMinutes();
        let e_mm = e_date.getMinutes();
        function zero_pad(n) { return (n < 10) ? "0" + n : n; }
        const s_time = `${zero_pad(s_hh)}:${zero_pad(s_mm)}`;
        const e_time = `${zero_pad(e_hh)}:${zero_pad(e_mm)}`;
        
        // >>> 241101 hjkim - 스택바 차트 데이터 경로 수정
        var msg = "";
        if(_data.label == undefined) {
            msg = `<br>(${_data.Memo}) 측정중...`;
        } else {
            msg = _data.label.split('_').join("<br>") + "<br>측정중...";
        }
        // <<< 241101 hjkim - 스택바 차트 데이터 경로 수정
        // >>> 240223 hjkim - stack 클릭 이벤트
        // console.log("main.js / _left_pos, _total_range : ", _left_pos, _total_range);
        // console.log("main.js / _left_pos : ", _left_pos/_total_range*100);
        var res = render_html(STACK_CLASSNAME, _left_pos/_total_range*100, (TIME_PADDING*2)/_total_range*100, `${s_time}~${e_time}`, msg, _data.url);
        // <<< 240223 hjkim - stack 클릭 이벤트
        // >>> 240227 hjkim - 스택바의 최근 값 출력
        SoftSensor.impedance_url = _data.url; // last one
        // >>> 240227 hjkim - 스택바의 최근 값 출력
        return res;
        
        function render_html(_sth_class, _left_pos, _time_padding, _date_text, _msg, _url) {
            // console.log("main.js / _left_pos2 : ", _left_pos);
            /*
            <div class="line stack-bg-color" style="width: 3%;left: 12%">
            <span class="tooltip-box">
            <div class="tooltip-box-inner">
            <div class="date">10:45~10:50</div>
            <div class="text">Stack 측정</div>
            </div>
            </span>
            </div>
            */
            // >>> 240223 hjkim - stack 클릭 이벤트
            return `
            <div class="line ${_sth_class}" style="position:absolute; width:${_time_padding}%; left:${_left_pos}%;" onclick="SoftSensor.stack_click_handler('${_url}', event)">
            <span class="tooltip-box">
            <div class="tooltip-box-inner">
            <div class="date">${_date_text}</div>
            <div class="text">${_msg}</div>
            </div>
            </span>    
            </div>`;
            // <<< 240223 hjkim - stack 클릭 이벤트 
        }
        
    },
    // >>> 240226 hjkim - Draw Nyquist Plot
    stack_click_handler: (_url, e) => {
        // >>> 250213 hjkim - BOP 스택 이동 기능 
        location.href = `stack.html?${location.search}&stime=${e.target.getAttribute("stime")}`;
        // <<< 250213 hjkim - BOP 스택 이동 기능 
        // >>> 240228 hjkim - Stack bar에 데이터가 없을 경우,
        if(g_el.stack_event.lastElementChild == null) return;
        // <<< 240228 hjkim - Stack bar에 데이터가 없을 경우,
        // >>> 240227 hjkim - 선택시 클래스 표시
        if(e == null) g_el.stack_event.lastElementChild.classList.add("active");
        else {
            let _active_el = g_el.stack_event.querySelectorAll(".active");
            _active_el.forEach(el => el.classList.remove("active")); 
            e.target.classList.add("active");
        }
        // <<< 240227 hjkim - 선택시 클래스 표시
        
        // >>> 240227 hjkim - 스택바의 최근 값 출력
        SoftSensor.impedance_url = _url;
        // <<< 240227 hjkim - 스택바의 최근 값 출력 
        const _placeholder_el = document.querySelector(".widget.bop-senser-data .widget-body");
        _placeholder_el.innerHTML = "";
        
        // Nyquist Plot - Init
        var NyquistPlot = {};
        ImpedanceChart.Interface( NyquistPlot );
        NyquistPlot.IImpedanceChart_init( _placeholder_el, _placeholder_el.clientWidth, _placeholder_el.clientHeight );
        
        // Fetch impedance data from server.
        const M_OHM = 1000;
        const COLOR = "#00FF00";
        fetch(_url).then(d => d.text())
        .then( txt => txt.split("\n") )
        .then( row => row.map(d => d.split(" ") ) ) // to Arr
        .then( arr => arr.map(d => d.map( _d => _d*1) ) ) // to Number
        .then( arr => arr.map(d => { d[1]*= M_OHM; d[2]*= M_OHM*-1; return d; }))
        .then( d => {
			const seconds_col = d.map(row => isNaN(row[1]) ? 0 : row[1]);
			const max_x = Math.max(...seconds_col);
            // Nyquist Plot - Run(Add Point)
            NyquistPlot._draw_imp_data( d, COLOR, _placeholder_el, undefined, undefined, undefined, undefined, undefined, max_x+50 );
        });
        
        // Update Gadget Link
        const _gadget_el = document.querySelector(".widget.bop-senser-data .widget-head .widget-head-gadget");
        // >>> 240227 hjkim - gadget 링크에 이벤트 핸들러 추가
        _gadget_el.removeEventListener("click", SoftSensor.head_gadget_click_handler);
        _gadget_el.addEventListener("click", SoftSensor.head_gadget_click_handler);
        // >>> 240227 hjkim - gadget 링크에 이벤트 핸들러 추가
    },
    // >>> 240227 hjkim - gadget 링크에 이벤트 핸들러 추가
    head_gadget_click_handler: () => {
        location.href = "stack.html?url=" + SoftSensor.impedance_url;
    },
    // >>> 240227 hjkim - gadget 링크에 이벤트 핸들러 추가
    // <<< 240226 hjkim - Draw Nyquist Plot
    done_sth_for_stack: (_html) => {
        if(g_el.stack_event == null) return;
        g_el.stack_event.style.position = "relative";
        g_el.stack_event.innerHTML = _html;
        // >>> 240227 hjkim - 스택바의 최근 값 출력 
        //SoftSensor.stack_click_handler(SoftSensor.impedance_url);
        // >>> 240227 hjkim - 스택바의 최근 값 출력
    },
    /* 
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │     FUNCTION SET for BOP                                                    │
    └─────────────────────────────────────────────────────────────────────────────┘
    */
    init_sth_for_bop_result : () => {
        if(g_el.result_diagnosis == null) return;
        g_el.result_diagnosis.innerHTML = "";
    },
    run_sth_for_bop_result : (relative_time, value, range, total_unit, d, time_flag) => {
        if(g_el.result_diagnosis == null) return;
        /*
        Result
        0  : 정상
        1  : (공기)MFM 전 누설
        2  : (공기)MFM 후 누설
        3  : (공기)블로워
        4  : (공기)유량센서
        5  : (공기)압력센서
        6  : (물)가습기
        7  : (물)스택 입구 온도센서
        8  : (물)스택 출구 온도센서
        9  : (열)열교환기
        10 : (열)1차 냉각수 펌프
        11 : (열)2차 냉각수 펌프
        12 : (열)스택 입구 온도센서
        13 : (열)스택 출구 온도센서
        14 : (열)열교환기 출구 온도센서
        15 : 진단불가
        */
        var bg_color = "";
        var normal_color = "";
        // >>> 240228 hjkim - tooltip contents
        var tooltip_contents = "";
        // <<< 240228 hjkim - tooltip contents
        switch(value) {
            case "0": // green
            bg_color = "";
            // >>> 240228 hjkim - tooltip contents
            tooltip_contents = "";
            // <<< 240228 hjkim - tooltip contents
            break;
            case "1": // skyblue
			bg_color = "air-bg-color";
			tooltip_contents = "공기공급계(1)<br>MFM전누설";
			break;
            case "2": // skyblue
			bg_color = "air-bg-color";
			tooltip_contents = "공기공급계(2)<br>MFM후누설";
			break;
            case "3": // skyblue
			bg_color = "air-bg-color";
			tooltip_contents = "공기공급계(3)<br>블로워";
			break;
            case "4": // skyblue
			bg_color = "air-bg-color";
			tooltip_contents = "공기공급계(4)<br>유량센서";
			break;
            case "5": // skyblue
			bg_color = "air-bg-color";
			tooltip_contents = "공기공급계(5)<br>압력센서";
			break;
            case "6": // blue
			bg_color = "water-bg-color";
			tooltip_contents = "물관리계(6)<br>가습기";
			break;
            case "7": // blue
			bg_color = "water-bg-color";
			tooltip_contents = "물관리계(7)<br>스택 입구 온도센서(물)";
			break;
            case "8": // blue
            bg_color = "water-bg-color";
			tooltip_contents = "물관리계(8)<br>스택 출구 온도센서(물)";
            break;
            case "9": // pink
			bg_color = "heat-bg-color";
			tooltip_contents = "열관리계(9)<br>열교환기";
			break;
            case "10": // pink
			bg_color = "heat-bg-color";
			tooltip_contents = "열관리계(10)<br>1차 냉각수 펌프";
			break;
            case "11": // pink
			bg_color = "heat-bg-color";
			tooltip_contents = "열관리계(11)<br>2차 냉각수 펌프";
			break;
            case "12": // pink
			bg_color = "heat-bg-color";
			tooltip_contents = "열관리계(12)<br>스택 입구 온도센서(열)";
			break;
            case "13": // pink
			bg_color = "heat-bg-color";
			tooltip_contents = "열관리계(13)<br>스택 출구 온도센서(열)";
			break;
            case "14": // pink
            bg_color = "heat-bg-color";
			tooltip_contents = "열관리계(14)<br>열교환기 출구 온도센서";
            break;
			// >>> 241126 hjkim - 공기부족(15)추가
			case "15":
			bg_color = "air-bg-color";
			tooltip_contents = "공기공급계(15)<br>공기부족";
			break;
			// <<< 241126 hjkim - 공기부족(15)추가
            default:
            bg_color = "";
            // >>> 240228 hjkim - tooltip contents
            tooltip_contents = "";
            // <<< 240228 hjkim - tooltip contents
            break;
        }
        // >>> 240228 hjkim - tooltip contents
        function zero_pad(n) { return (n < 10) ? "0" + n : n; }
        var tooltip = "";
        // if(time_flag[d[0]]) {
        //     console.log( d[0], d[1], time_flag[d[0]], tooltip_contents);
        // }
        if( time_flag[d[0]] && tooltip_contents != "") {
            var date = new Date( d[0] );
            tooltip = `<span class="tooltip-box">
            <div class="tooltip-box-inner">
            <div class="date">${zero_pad( date.getHours() )}:${zero_pad( date.getMinutes() )}</div>
            <div class="text">${tooltip_contents}</div>
            </div>
            </span>`;
        }
        // <<< 240228 hjkim - tooltip contents
		      let _title = tooltip_contents.replaceAll("<br>", "\n");
        // >>> 240626 hjkim - 바차트 시간축 불일치 버그 수정
        let _left_pos = relative_time / range * 100;
        // >>> 240720 hjkim - 그래프 툴팁박스 필터링
        return `
        <div class="line ${bg_color} show-${value}" title="${_title}" style="cursor:pointer; position:absolute; left:${_left_pos}%; width:calc(${100/total_unit}%); ${normal_color}" onclick="SoftSensor.tooltip_toggle_handler(event)">
        ${tooltip}
        </div>`;
        // <<< 240720 hjkim - 그래프 툴팁박스 필터링
        // <<< 240626 hjkim - 바차트 시간축 불일치 버그 수정
    },
    // >>> 240720 hjkim - 그래프 툴팁박스 필터링
    is_toggle: false, 
    tooltip_toggle_handler: (e) => {
        let div = e.target.closest('.line');
        if(SoftSensor.is_toggle == false) {
            let cls = div.className;
            let sel = "." + cls.split(/\s+/g).join(".");
            $("div.line").hide();
            $(sel).show();
            SoftSensor.is_toggle = true;
        } else {
            $("div.line").show();
            SoftSensor.is_toggle = false;
        }
    },
    // <<< 240720 hjkim - 그래프 툴팁박스 필터링
    done_sth_for_bop_result : (_html) => {
        if(g_el.result_diagnosis == null) return;
        // >>> 240626 hjkim - 바차트 시간축 불일치 버그 수정
        g_el.result_diagnosis.style.setProperty("position", "relative");
        // <<< 240626 hjkim - 바차트 시간축 불일치 버그 수정
        g_el.result_diagnosis.innerHTML = _html;
    }
};

// >>> 240122 hjkim - 범례 초기화 작업
const hard_system = [
    // >>> 240307 hjkim - 주요 변수 추가
    ["T_A_B_in(116)", "P_A_B_in(105)", "MFM3(Air)", "Air(%)", "P_A_m_out(102)", "T_A_m_out(110)"],
    ["T_A_S_in(113)", "T_A_S_out(109)", "T_A_vent(115)", "P_A_S_in(101)", "P_A_S_out(104)"],
    // <<< 240307 hjkim - 주요 변수 추가
    // >>> 240306 hjkim - 주요 변수 추가
    ["T_w_t_in(101)", "T_w_t_ou(102)", "P_w_p_in(1)", "P_w_p_out(2)", "MFM1(Water)", "Water(%)", "T_w_h_out(103)", "T_w_h_in(104)", "P_w_h_out(6)", "T_DI_h_out(107)",
    "T_DI_S_out(108)", "DI_Conductivity", "P_DI_p_out(4)", "DI(%)", "P_DI_p_out(5)", "MFM2(DI)", "T_DI_S_in(114)"],
    ["T_F_S_in(112)", "T_F_S_out(111)", "P_F_S_in(103)", "MFC1(H2)", "MFC2(N2)", "Current", "Voltage"],
    // <<< 240306 hjkim - 주요 변수 추가
];
// >>> 240910 hjkim - 범례 토글 버그 수정
const soft_system = () => [
    ["R_Air_deltaP", "R_Air_U", "R_Air_P1", "R_Air_V"],
    ["R_Water_R1", "R_Water_R2", "R_Water_R3"],
    ["R_heat", "R_Ms", "R_Mr"],
    ["R_DI", "R_WP"],
];
// const soft_system = () => {
//     let r = [];
//     for(let i = 1; i < 5; i++) {
//         let arr = Array.from(document.querySelectorAll(`#soft-sensor-list .tree li:nth-child(${i}) details li>span>span`)).map(el => el.innerText);
//         r.push()
//     }
//     return r;
// }
// <<< 240910 hjkim - 범례 토글 버그 수정
const hard_label = hard_system.join(",").split(",");
const soft_label = soft_system().join(",").split(",");
// const hard_graph = g_graph_inst;
// const soft_graph = g_graph_soft;
document.addEventListener('DOMContentLoaded', () => {
    adaptor_make_legend();
});

function adaptor_make_legend() {
    const chk_els = document.querySelectorAll(".widget.HW-bop-senser-list input[type='checkbox']");
    const chk_els2 = document.querySelectorAll(".widget.soft-senser-list input[type='checkbox']");
    const group_els = document.querySelectorAll(".widget.HW-bop-senser-list span.group-title");
    const group_els2 = document.querySelectorAll(".widget.soft-senser-list span.group-title");  
    const deco_els = document.querySelectorAll(".widget.HW-bop-senser-list span.deco");
    const deco_els2 = document.querySelectorAll(".widget.soft-senser-list span.deco");
    const check_all = document.querySelector(".widget.HW-bop-senser-list .widget-head-gadget .mini:nth-child(1)");
    const check_all2 = document.querySelector(".widget.soft-senser-list .widget-head-gadget .mini:nth-child(1)");
    const except_all = document.querySelector(".widget.HW-bop-senser-list .widget-head-gadget .mini:nth-child(2)");
    const except_all2 = document.querySelector(".widget.soft-senser-list .widget-head-gadget .mini:nth-child(2)");
    // >>> 240123 hjkim - Hard 범례 바인딩
    // 전체 선택/해제
    // check_all.addEventListener("click",  () => all_graph("on") );
    // except_all.addEventListener("click", () => all_graph("off") );
    // check_all2.addEventListener("click",  () => all_graph("on", g_graph_soft) );
    // except_all2.addEventListener("click", () => all_graph("off", g_graph_soft) );
    // >>> 240927 hjkim - 범례 ALL 버그 수정
    const soft_legend_select_all = () => Array.from(document.querySelectorAll("#soft-sensor-list .tree-ui details input")).map(el => el.checked = true);
    const hard_legend_select_all = () => Array.from(document.querySelectorAll("#hw-bop-sensor-list .tree-ui ul input")).map(el => el.checked = true);
    const soft_legend_deselect_all = () => Array.from(document.querySelectorAll("#soft-sensor-list .tree-ui details input")).map(el => el.checked = false);
    const hard_legend_deselect_all = () => Array.from(document.querySelectorAll("#hw-bop-sensor-list .tree-ui ul input")).map(el => el.checked = false);

    // >>> 241025 hjkim - Hard/Soft 센서 범례 연동
    function legend_soft_select_all() {
        soft_legend_select_all(); 
        all_graph("on", g_graph_soft); 
    }
    function legend_soft_deselect_all() {
        soft_legend_deselect_all();
        all_graph("off", g_graph_soft); 
    }
    function legend_hard_select_all() {
        hard_legend_select_all(); 
        all_graph("on", g_graph_inst); 
    }
    function legend_hard_deselect_all() {
        hard_legend_deselect_all();
        all_graph("off", g_graph_inst); 
    }
    check_all2.addEventListener("click", legend_soft_select_all);
    except_all2.addEventListener("click", legend_soft_deselect_all);
    check_all.addEventListener("click",  legend_hard_select_all);
    except_all.addEventListener("click",  legend_hard_deselect_all);
    // <<< 241025 hjkim - Hard/Soft 센서 범례 연동
    // check_all2.addEventListener("click", soft_legend_select_all);
    // check_all.addEventListener("click",  hard_legend_select_all);
    // except_all2.addEventListener("click", soft_legend_deselect_all);
    // except_all.addEventListener("click",  hard_legend_deselect_all);
    // <<< 240927 hjkim - 범례 ALL 버그 수정
    // 그룹 범례 바인딩
    
    // >>> 241025 hjkim - Hard 센서 그룹체크 버그 수정
    let hard_group_chk = Array.from(chk_els).filter(el => (el.nextSibling == null));
    function toggle_hard_subsystem_legend(e) {
        try{
            let subsystem_el = e.target.parentElement.parentElement.parentElement.querySelectorAll("ul li input[type='checkbox']");
            if(e.target.checked == true) { 
                Array.from(subsystem_el).map((el, idx) => { el.checked = true; }); 
            } else { 
                Array.from(subsystem_el).map((el, idx) => { el.checked = false; });
            }
        } finally {}
    }
    // 범례 그룹 
    hard_group_chk.map((el) => { el.addEventListener("click", toggle_hard_subsystem_legend) });
    // 그래프 토글핸들러 초기화
    hard_group_chk.map((el, idx)  => {
        el.addEventListener('change', () => { set_x_system_graph(idx, hard_system, g_graph_inst, el.checked); });
    });
    // <<< 241025 hjkim - Hard 센서 그룹체크 버그 수정
    
    // 개별 범례 바인딩
    let hard_chk = Array.from(chk_els).filter(el => (el.nextSibling != null))
    hard_chk.map((el, idx)  => {
        el.addEventListener('change', () => { __group_chk_valid(el);
            toggle_nth_graph(idx);
        });
    });
    // 그룹 범례 볼드 바인딩

    Array.from(group_els).map((el, idx)  => { el.style.fontWeight = "normal"; el.style.cursor = "pointer";
        return el.addEventListener('click', () => { var _status = __style_bold(el);
            Array.from(el.parentElement.querySelectorAll("span.deco:not(.square) span"))
            .map(el => { 
                el.style.fontWeight = _status;
            });
            set_x_system_bold(idx, hard_system, g_graph_inst, _status);
        });
    });
    // 개별 범례 볼드 바인딩
    Array.from(deco_els).filter(el => (el.className.indexOf("square") == -1))
    .map((el, idx) => {
        var new_span = document.createElement('span'); new_span.textContent = el.textContent;
        el.lastChild.nodeValue = ""; el.appendChild(new_span); return new_span; 
    })
    .map((el, idx) => {
        el.style.fontWeight = "normal"; 
        el.style.cursor = "pointer";
        return el.addEventListener('click', () => { 
            __style_bold(el); 
            toggle_nth_bold(idx)
        });
    });
    // <<< 240123 hjkim - Hard 범례 바인딩

    // >>> 241025 hjkim - Soft 센서 그룹체크 버그 수정
    let = soft_group_chk = Array.from(chk_els2).filter(el => (el.nextSibling == null));
    function toggle_soft_subsystem_legend(e) {
        try {
            let subsystem_el = e.target.parentElement.parentElement.parentElement.querySelectorAll("ul li input[type='checkbox']");
            if(e.target.checked == true) { 
                Array.from(subsystem_el).map((el, idx) => { el.checked = true; }); 
            } else { 
                Array.from(subsystem_el).map((el, idx) => { el.checked = false; });
            }
        } finally {}
    }
    // 범례 그룹
    soft_group_chk.map((el) => { el.addEventListener("click", toggle_soft_subsystem_legend); });
    // 그래프 토글핸들러 초기화
    soft_group_chk.map((el, idx)  => { 
        el.addEventListener('change', () => { set_x_system_graph(idx, soft_system(), g_graph_soft, el.checked); });
    });
    // >>> 241025 hjkim - Soft 센서 그룹체크 버그 수정

    // >>> 241025 hjkim - Soft 센서와 Hard 센서의 바인딩
    const bind_model = {
        "R_Air_deltaP"  : ["T_A_B_in(116)", "Current", "MFM3(Air)", "deltaP", "P_A_m_out(102)", "P_A_B_in(105)"],
        "R_Air_U"       : ["T_A_B_in(116)", "Current", "MFM3(Air)", "Air(%)"],
        "R_Air_P1"      : ["T_A_B_in(116)", "Current", "MFM3(Air)", "P_A_B_in(105)"],
        "R_Air_V"       : ["T_A_B_in(116)", "Current", "Voltage"],
        "R_heat"        : ["T_A_B_in(116)", "Current", "DI(%)", "Water(%)", "T_w_h_in(104)", "UA", "V_th(1.48)", "No_cell(35)", "Voltage"],
        "R_Ms"          : ["T_A_B_in(116)", "Current", "DI(%)", "Ms", "V_th_s(1.44)", "No_cell(35)", "Voltage", "Current", "T_DI_S_out(108)", 
            "T_DI_h_out(107)"],
        "R_Mr"          : ["T_A_B_in(116)", "Current", "Water(%)", "Mr", "V_th_r(2.1)", "No_cell(35)", "Voltage", "Current", "T_w_h_out(103)", "T_w_h_in(104)"],
        "R_Water_R1"    : ["T_A_B_in(116)", "Current", "T_A_S_in(113)"],
        "R_Water_R2"    : ["T_A_B_in(116)", "Current", "T_A_S_out(109)"],
        "R_Water_R3"    : ["T_A_B_in(116)", "Current", "T_A_vent(115)"],
        "R_DI"            : ["T_A_B_in(116)", "Current", "DI(%)"],
        "R_WP"            : ["T_A_B_in(116)", "Current", "Water(%)"],
    };
    function init_hard_input_el(_hard_chk) {
        return _hard_chk.reduce((acc, cur) => {
            let t = cur.parentElement.innerText.trim();
            t = t.replace(/\u200B/gi, '');
            acc[t] = cur;
            return acc;
        }, {});
    }
    var hard_chk_el = init_hard_input_el(hard_chk);
    var _IS_HARD_CHECKED = {}; 
    let soft_chk = Array.from(chk_els2).filter(el => (el.nextSibling != null));
    soft_chk.map((el, idx)  => {
        let label_text = el.parentElement.innerText.trim();
        label_text = label_text.replace(/\u200B/gi, '');
        let keys = Object.keys(bind_model);
        // Soft 센서 체크박스를 처리하는 코드

        keys.map((k) => {
            if(label_text.indexOf(k) != 0) return; // Early Exit
            el.addEventListener("click", (e) => {
                var _ACTION = e.target.checked == true ? "ON" : "OFF";
                bind_model[k].map((key_name) => { 
                    if(hard_chk_el[key_name] != undefined) {
                        // TODO: 멀티 Soft 센서 체크박스 or 연산이 안됨
                        if(_ACTION == "ON") {
                            if(_IS_HARD_CHECKED[key_name] != true ) {
                                _IS_HARD_CHECKED[key_name] = true;
                                hard_chk_el[key_name].click();
                            }
                        } else if(_ACTION == "OFF") {
                            if(_IS_HARD_CHECKED[key_name] == true ) {
                                _IS_HARD_CHECKED[key_name] = false;
                                hard_chk_el[key_name].click();
                            }
                        }
                    }
                });
            });
        });
        el.addEventListener('change', () => { __group_chk_valid(el);
            toggle_nth_graph(idx, soft_label, g_graph_soft);
        });
    });
    // >>> 241025 hjkim - Soft 센서와 Hard 센서의 바인딩

    // 그룹 범례 볼드 바인딩
    Array.from(group_els2)
    .map((el, idx)  => { el.style.fontWeight = "normal"; el.style.cursor = "pointer";
        return el.addEventListener('click', () => { var _status = __style_bold(el);
            Array.from(el.parentElement.querySelectorAll("span.deco:not(.square) span"))
            .map(el => { el.style.fontWeight = _status; });
            set_x_system_bold(idx, soft_system(), g_graph_soft, _status);
        });
    });
    // 개별 범례 볼드 바인딩
    Array.from(deco_els2).filter(el => el.className.indexOf("square") == -1)
    .map((el, idx) => { var new_span = document.createElement('span'); new_span.textContent = el.textContent;
    el.lastChild.nodeValue = ""; el.appendChild(new_span); return new_span; })
    .map((el, idx) => { el.style.fontWeight = "normal"; el.style.cursor = "pointer";
    return el.addEventListener('click', () => { __style_bold(el);
        toggle_nth_bold(idx, soft_label, g_graph_soft)} );
    });
    // <<< 240123 hjkim - Soft 범례 바인딩

    // >>> 240123 hjkim - 데이터 변경 바인딩
    document.body.addEventListener("data_refreshed", () => {
        // Hard 범례 갱신
        Array.from(chk_els).filter(el => (el.nextSibling != null))
        .map((el, idx) => {if(!el.checked) toggle_nth_graph(idx); } );
        
        // Soft 범례 갱신
        setTimeout(() => {
            Array.from(chk_els2).filter(el => (el.nextSibling != null))
            .map((el, idx) => {if(!el.checked) toggle_nth_graph(idx, soft_label, g_graph_soft); } );
        }, 50);
    });
    // <<< 240123 hjkim - 데이터 변경 바인딩
}  

function __style_bold(el) { return el.style.fontWeight = (el.style.fontWeight == "bold") ? "normal" : "bold"; }
function __line_show(d, l) { if(d.label === l) { d.lines.show = !d.lines.show; } }
function __set_line_show(d, l, t) { if(d.label === l) { d.lines.show = t; } }
function __line_bold(d, l) { 
    if(d.label.indexOf(l) != 0) return;
    if (d.lines.lineWidth < 2) { d.lines.lineWidth *= 3; } else { d.lines.lineWidth = 1.5; }
}

function __set_line_bold(d, l, t) {
    if(d.label.indexOf(l) != 0) return;
    d.lines.lineWidth = 1.5; t == "bold" ? d.lines.lineWidth *= 3 : d.lines.lineWidth = 1.5;
}

function __group_chk_valid(el) {
    var _group_el = el.parentElement.parentElement.parentElement.parentElement;
    var _group_chk = _group_el.querySelector("summary input[type='checkbox']");
    var _detail_chk = _group_el.querySelectorAll("ul>li>span>input[type='checkbox']");
    var _detail_chked = _group_el.querySelectorAll("ul>li>span>input[type='checkbox']:checked");
    if(_detail_chk.length == _detail_chked.length) { _group_chk.checked = true; }
}

function all_graph(onoff = "on", _graph_type = g_graph_inst) {
    // 줌 상태 복원
    restoreZoomState("BOP진단");
    const d = _graph_type.getData();
    if(onoff == "on") d.map(d => {d.lines.show = true;} );
    else d.map(d => {d.lines.show = false;} );
    _graph_type.setupGrid();
    _graph_type.draw();
}

function toggle_x_system_graph(num = 0, _label_system = hard_system, _graph_type = g_graph_inst) {
    const d = _graph_type.getData(), l = _label_system[num];
    d.map(d => { l.map(l => __line_show(d, l)); });
    _graph_type.draw();
}

function set_x_system_graph(num = 0, _label_system = hard_system, _graph_type = g_graph_inst, _type = true) {
    const d = _graph_type.getData(), l = _label_system[num];
    d.map(d => { l.map(l => __set_line_show(d, l, _type)); });
    _graph_type.draw();
}

function toggle_nth_graph(num = 0, _label = hard_label, _graph_type = g_graph_inst) {
    const d = _graph_type.getData(), l = _label[num];
    d.map(d => {
        __line_show(d, l);
    });
    _graph_type.draw();
}

function toggle_x_system_bold(num  = 0, _label_system = hard_system, _graph_type = g_graph_inst) {
    const d = _graph_type.getData(), l = _label_system[num];
    d.map(d => { l.map(l =>  __line_bold(d, l)); });
    _graph_type.draw();
}

function set_x_system_bold(num  = 0, _label_system = hard_system, _graph_type = g_graph_inst, _type = "bold") {
    const d = _graph_type.getData(), l = _label_system[num];
    d.map(d => { l.map(l => __set_line_bold(d, l, _type)); });
    _graph_type.draw();
}

function toggle_nth_bold(num = 0, _label = hard_label, _graph_type = g_graph_inst) {
    const d = _graph_type.getData(), l = _label[num];
    d.map(d => __line_bold(d, l));
    _graph_type.draw();
}

// <<< 240122 hjkim - 범례 초기화 작업


/* -------------------------------------------------------------------------- */
/*                               WEB WORKER                                   */
/* -------------------------------------------------------------------------- */

function parse_recurse(url        , map, lv, fn_apply_el) {
    if(lv == 4) return;
    var last_idx = url.lastIndexOf("/");
    var parent_url = url.slice(0, last_idx + 1);
    var sel_list = map[parent_url];
    fn_apply_el(sel_list, lv);
    parse_recurse(parent_url.slice(0, -1), map, ++lv, fn_apply_el);
}

// 웹 워커 생성
const worker = new Worker("js/data.js");
channel1.port2.onmessage = (e) => {
    var url, url_history, data, html;
    switch(e.data.msg) {
        case "CH1/(a)DASHBOARD_DATA":
            url = e.data.url;
            url_history = e.data.history;
            // 전역변수에 질의할 URL 반영
            window.g_data_url = url;
            retry(`(g_el.timely != null) && (Calendex._fn_init_graph != null)`, 10, 100, () => {
                // >>> 240822 hjkim - 데이터 경로 변경(WIP)
                const sel_el = [g_el.timely, g_el.daily, g_el.monthly, g_el.yearly];
                // URL 파싱해서 Select 박스 UI에 적용.
                parse_recurse(url, url_history.map, 0, (sel_list, lv) => {
                    // 초기화
                    var _t = "";
                    lv == 0 ? _t = "시" : lv == 1 ? _t = "일" : lv == 2 ? _t = "월" : lv == 3 ? _t = "년" : _t = "";
                    sel_el[lv].innerHTML = `<option value=-1 selected>-${_t}(${(sel_list.length)}개)-</option>`;
                    sel_list.map((d, idx) => {
                        var is_selected = (url.includes(d)) ? "selected":"";
                        sel_el[lv].innerHTML += `<option value="${d}" ${is_selected}>${d}</option>`;
                    });
                });
                Calendex._fn_init_graph();
                // <<< 240822 hjkim - 데이터 경로 변경(WIP)
            });
        break;

        case "CH1/(b)YEARLY_REFRESH":
            retry(`g_el.yearly != null`, 10, 100, () => {
                Calendex.refresh_yearly(e.data.list);
                g_el.yearly.value = get_cookie("FDC_calendex_yearly");
            });
        break;
        case "CH1/(c)MONTHLY_REFRESH":
            retry(`g_el.monthly != null`, 10, 100, () => {
                Calendex.refresh_monthly(e.data.list);
                g_el.monthly.value = get_cookie("FDC_calendex_monthly");
            });
        break;
        case "CH1/(d)DAILY_REFRESH":
            retry(`g_el.daily != null`, 10, 100, () => {
                Calendex.refresh_daily(e.data.list);
                g_el.daily.value = get_cookie("FDC_calendex_daily");
            });
        break;
        case "CH1/(e)TIMELY_REFRESH":
            retry(`g_el.timely != null`, 10, 100, () => {
                Calendex.refresh_timely(e.data.list);
                g_el.timely.value = get_cookie("FDC_calendex_timely");
            });
        break;

        case "CH1/(f)BOP_DATA":
            {
            url = e.data.url;
            window.g_data_url = url; // 현재 url을 전역변수에 저장
            url_history = e.data.history;
            retry(`(g_el.timely != null) && (Calendex._fn_init_graph != null)`, 10, 100, () => {
                // >>> 240822 hjkim - 데이터 경로 변경(WIP)
                const sel_el = [g_el.timely, g_el.daily, g_el.monthly, g_el.yearly];
                // URL 파싱해서 Select 박스 UI에 적용.
                parse_recurse(url, url_history.map, 0, (sel_list, lv) => {
                    // 초기화
                    var _t = "";
                    lv == 0 ? _t = "시" : lv == 1 ? _t = "일" : lv == 2 ? _t = "월" : lv == 3 ? _t = "년" : _t = "";
                    sel_el[lv].innerHTML = `<option value=-1 selected>-${_t}(${(sel_list.length)}개)-</option>`;
                    sel_list.map((d, idx) => {
                        var is_selected = (url.includes(d)) ? "selected":"";
                        sel_el[lv].innerHTML += `<option value="${d}" ${is_selected}>${d}</option>`;
                    });
                });
                // >>> 240822 hjkim - 데이터 경로 변경(WIP)
                Calendex._fn_init_graph();
            });
            // flot_data fetch
            let wsize = document.querySelector("#wsize").value;
            channel1.port2.postMessage({
                msg: "CH1/(4)BOP_DATA_FETCH", 
                url: url, 
                imp_url: "/ALL/data/impedance/imp_data/", 
                window_size: parseInt(wsize),
                debug: "L2978" 
            });
            }
        break;
        case "CH1/(g)BOP_SOFT_FLOTDATA":
            // >>> 240802 hjkim - 대시보드 그래프 갱신 안되는 버그 수정
            if(!is_title("BOP진단")) return;
            // <<< 240802 hjkim - 대시보드 그래프 갱신 안되는 버그 수정
            // 소프트센서그래프와 HW센서 그래프 드로잉
            const softsensor_flotdata = e.data.flotdata;
            if(softsensor_flotdata.length) SoftSensor.Init_sw_sensor_graph(softsensor_flotdata);

            // >>> 240612 hjkim - Sync Crosshair 
            $(".sw_sensor_graph").bind("plothover", (e, pos) => { if(g_graph_inst != null) g_graph_inst.setCrosshair(pos); });
            // <<< 240612 hjkim - Sync Crosshair 
        break;
        case "CH1/(h)BOP_HARD_FLOTDATA":
            g_graph_data = e.data.flotdata;
            // >>> 240802 hjkim - 대시보드 그래프 갱신 안되는 버그 수정
            if(is_title("대시보드")) {
                // >>> 250120 hjkim - [Dashboard] BOP 차트 ratio 안보이게
                TimeSeriesPlot.set_csv_type("EVENT_DATA");
                const G_APPLYING_COND = `window.g_applying_calendex_state == false`;
                const G_YEARLY_COND   = `g_el.yearly.value != '' && g_el.yearly.value != '-1'`;
                const G_MONTHLY_COND  = `g_el.monthly.value != '' && g_el.monthly.value != '-1'`;
                const G_DAILY_COND    = `g_el.daily.value != '' && g_el.daily.value != '-1'`;
                const __COND = `${G_APPLYING_COND} && ${G_YEARLY_COND} && ${G_MONTHLY_COND} && ${G_DAILY_COND}`;
                fetch(window.g_event_url(parseInt(g_el.yearly.value), parseInt(g_el.monthly.value), parseInt(g_el.daily.value), STACK_NAME()))
                .then(d => d.text())
                .then(data => {
                    if(data.indexOf("0,") == 0 || data.indexOf("1,") == 0) {
                        let data1 = window.data_classify(data, 1);
                        if(data1.length != 0) {
                            data1 = "sTime,eTime,Type,Amp,Memo\n"+data1;
                            data1 = TimeSeriesPlot.DataPreprocessing.parse_xsv(data1, ",")
                            let _stime = data1[0].sTime;
                            // console.log("!@#$ data1 : ", data1);
                            let _html = data1.reduce((acc_html, d, idx) => {
                                acc_html += SoftSensor.run_sth_for_stack2(d, (e.data.etime-e.data.stime), _stime);
                                return acc_html;
                            }, "");
                            // console.log("!@#$ _html : ", _html);
                            SoftSensor.done_sth_for_stack(_html);
                        }
                        data = window.data_classify(data, 0);
                        data = "sTime,eTime,Type,Amp,Memo\n"+data;
                    }
                    return data;
                })
                .then(txt => TimeSeriesPlot.DataPreprocessing.parse_xsv(txt, ","))
                .then((event_json) => {
                    TimeSeriesPlot.mark_flot(event_json);
                    toggle_flot_by_label("Flag");
                    toggle_flot_by_label("SoH");
                    toggle_flot_by_label("Ratio_E01");
                    toggle_flot_by_label("Ratio_E02");
                    toggle_flot_by_label("Ratio_E03");
                    toggle_flot_by_label("Ratio_E04");
                    toggle_flot_by_label("Ratio_E05");
                    toggle_flot_by_label("Ratio_E06");
                    toggle_flot_by_label("Ratio_E07");
                    toggle_flot_by_label("Ratio_E08");
                    toggle_flot_by_label("Ratio_E09");
                    toggle_flot_by_label("Ratio_E10");
                    toggle_flot_by_label("Ratio_E11");
                    toggle_flot_by_label("Ratio_E12");
                    toggle_flot_by_label("Ratio_E13");
                    toggle_flot_by_label("Ratio_E14");
                    toggle_flot_by_label("Ratio_E15");
                });
                return;
                // <<< 250120 hjkim - [Dashboard] BOP 차트 ratio 안보이게
            }
            // <<< 240802 hjkim - 대시보드 그래프 갱신 안되는 버그 수정
            // >>> 240722 hjkim - 그래프 드래그의 시간 데이터
            set_selected_label(e.data.stime, e.data.etime);
            // <<< 240722 hjkim - 그래프 드래그의 시간 데이터

            // >>> 240723 hjkim - 센서 레이블 데이터 가져오기
            // window.ch2_1_msg_obj = {};
            // window.ch2_1_msg_obj.msg = "CH2/(1)EVENT_CSV";
            // window.ch2_1_msg_obj.cmd = "GET";
            // window.ch2_1_msg_obj.sdate = `2022-01-01 00:00:00`;
            // window.ch2_1_msg_obj.edate = `${unix2yms(new Date().getTime())} 23:59:00`;
            // window.ch2_1_msg_obj.sdate = `${unix2yms(e.data.stime)} 00:00:00`;
            // window.ch2_1_msg_obj.edate = `${unix2yms(e.data.stime)} 23:59:00`;
            // channel1.port2.postMessage(window.ch2_1_msg_obj);
            // <<< 240723 hjkim - 센서 레이블 데이터 가져오기

            // >>> 240625 hjkim - add graph marking
            TimeSeriesPlot.set_csv_type("EVENT_DATA");
            // >>> 241010 hjkim - 이벤트 경로 수정
            
            // >>> 241104 hjkim - BOP 메뉴 회색 마커가 안나오는 버그 수정
            const G_APPLYING_COND = `window.g_applying_calendex_state == false`;
            const G_YEARLY_COND   = `g_el.yearly.value != '' && g_el.yearly.value != '-1'`;
            const G_MONTHLY_COND  = `g_el.monthly.value != '' && g_el.monthly.value != '-1'`;
            const G_DAILY_COND    = `g_el.daily.value != '' && g_el.daily.value != '-1'`;
            const __COND = `${G_APPLYING_COND} && ${G_YEARLY_COND} && ${G_MONTHLY_COND} && ${G_DAILY_COND}`;
            // console.log("!@#$ L3370 __COND : ", __COND);
            retry(__COND, 10, 10, () => { get_event_data(); } );
            // >>> 241104 hjkim - BOP 메뉴 회색 마커가 안나오는 버그 수정

            function get_event_data() {
                fetch( window.g_event_url(parseInt(g_el.yearly.value), parseInt(g_el.monthly.value), parseInt(g_el.daily.value), STACK_NAME()) )
                // <<< 241010 hjkim - 이벤트 경로 수정
                .then(d => d.text())
                // >>> 241011 hjkim - get_event.php 전처리 부분
                .then(data => {
                    if(data.indexOf("0,") == 0 || data.indexOf("1,") == 0) {

                            // >>> 241101 hjkim - 스택바 차트 데이터 경로 수정
                        let data1 = window.data_classify(data, 1);
                        if(data1.length != 0) {
                            data1 = "sTime,eTime,Type,Amp,Memo\n"+data1;
                            data1 = TimeSeriesPlot.DataPreprocessing.parse_xsv(data1, ",")
                            let _stime = data1[0].sTime;
                            // console.log("!@#$ data1 : ", data1);
                            let _html = data1.reduce((acc_html, d, idx) => {
                                acc_html += SoftSensor.run_sth_for_stack2(d, (e.data.etime-e.data.stime), _stime);
                                return acc_html;
                            }, "");
                            // console.log("!@#$ _html : ", _html);
                            SoftSensor.done_sth_for_stack(_html);
                        }
                        // <<< 241101 hjkim - 스택바 차트 데이터 경로 수정

                        data = window.data_classify(data, 0);
                        data = "sTime,eTime,Type,Amp,Memo\n"+data;
                    }
                    return data;
                })
                // <<< 241011 hjkim - get_event.php 전처리 부분
                // .then(debug => {console.log("!@#$ L3114", debug); return debug; })
                .then(txt => TimeSeriesPlot.DataPreprocessing.parse_xsv(txt, ","))
                // .then(debug => {console.log("!@#$ L3116", debug); return debug; })
                .then(event_json => {
                    TimeSeriesPlot.mark_flot(event_json);
                    // >>> 241106 hjkim - hide Flag
                    toggle_flot_by_label("Flag");
                    // <<< 241106 hjkim - hide Flag
                    // >>> 241204 hjkim - hide ratio*
                    toggle_flot_by_label("Ratio_E01");
                    toggle_flot_by_label("Ratio_E02");
                    toggle_flot_by_label("Ratio_E03");
                    toggle_flot_by_label("Ratio_E04");
                    toggle_flot_by_label("Ratio_E05");
                    toggle_flot_by_label("Ratio_E06");
                    toggle_flot_by_label("Ratio_E07");
                    toggle_flot_by_label("Ratio_E08");
                    toggle_flot_by_label("Ratio_E09");
                    toggle_flot_by_label("Ratio_E10");
                    toggle_flot_by_label("Ratio_E11");
                    toggle_flot_by_label("Ratio_E12");
                    toggle_flot_by_label("Ratio_E13");
                    toggle_flot_by_label("Ratio_E14");
                    toggle_flot_by_label("Ratio_E15");
                    // <<< 241204 hjkim - hide ratio*
                });
                // <<< 240625 hjkim - add graph marking
            }

            // >>> 240612 hjkim - Sync Crosshair 
            $("#graph").bind("plothover", (e, pos) => { if(g_graph_soft != null) g_graph_soft.setCrosshair(pos); });
            // <<< 240612 hjkim - Sync Crosshair 
        break;
        case "CH1/(i)BOP_BARDATA":
            // console.log("main.js / CH1/(i)BOP_BARDATA / e.data: ", e.data);
            // FLOTDATA
            SoftSensor.init_sth_for_bop_result();
            data = e.data.bardata;
            const stime = e.data.stime;
            const etime = e.data.etime;
            const len = e.data.len;
            const time_flag = e.data.time_flag;
            _html = data.reduce((acc_html, d, idx) => {
                acc_html += SoftSensor.run_sth_for_bop_result((d[0] - stime), d[1], (etime - stime), len, d, time_flag);
                return acc_html;
            }, "");
            SoftSensor.done_sth_for_bop_result(_html);
        break;
        case "CH1/(j)STACK_BARDATA":
            // /ALL/data/impedance/imp_data/ & FLOTDATA
            SoftSensor.init_sth_for_stack();
            data = e.data.bardata;
            const _range = e.data.range;
            const timestamp_s = e.data.timestamp_s;
            _html = data.reduce((acc_html, d, idx) => {
                acc_html += SoftSensor.run_sth_for_stack(d, _range, timestamp_s)
                return acc_html;
            }, "");
            SoftSensor.done_sth_for_stack(_html);
        break;
        // >>> 240723 hjkim - 센서 레이블 데이터 가져오기
        case "CH2/(a)SENSOR_LABEL":
            if(e.data.status.indexOf("SUCCESS") == 0) {
                switch(e.data.status) {
                    case "SUCCESS_UPDATE":
                        break;
                    case "SUCCESS_DEL":
                    case "SUCCESS_DEL_RANGE":
                    case "SUCCESS_ADD":
                        // channel1.port2.postMessage(window.ch2_1_msg_obj);
                        var _state = load_calendex_state();
                        const _url = [BASE_DATA_URI(), _state[0], _state[1], _state[2], _state[3]].join("");
                        var wsize = (get_cookie("wsize") == "" || get_cookie("wsize") == undefined) ? document.querySelector("#wsize").value : get_cookie("wsize");
                        channel1.port2.postMessage({
                            msg: "CH1/(4)BOP_DATA_FETCH", 
                            url: _url, 
                            imp_url: "/ALL/data/impedance/imp_data/", 
                            window_size: parseInt(wsize),
                            debug: "L3072"
                        });
                        break;
                    case "SUCCESS_GET":
                    default:
                        // >>> 240726 hjkim - BOP 센서 라벨링 데이터 갱신
                        // const SensorLabelingEl = document.querySelector("#bop-labeling-data-table tbody.scrollmini.overflow-auto");
                        // SensorLabelingEl.innerHTML = "";
                        // const {tr, td, input, span} = van.tags;
                        // const SensorLabelingTr = () =>
                        //     e.data.eventdata.map(d => 
                        //         tr({stime:`${d.sTime}`, etime:`${d.eTime}`},
                        //             td(input({type:"checkbox"})),
                        //             td(
                        //                 span({class:"date-div", style: "cursor: pointer", onclick: ({target}) => {
                        //                         let txt = target.innerText.trim();
                        //                         let arr = txt.split("-");
                        //                         setTimeout(() => { set_opt("#yearly", arr[0], true); }, 1);
                        //                         setTimeout(() => { set_opt("#monthly", arr[1], true); }, 50);
                        //                         setTimeout(() => { set_opt("#daily", arr[2], true); }, 100);
                        //                     }
                        //                 }, d.sTime.split(" ")[0]+" "), 
                        //                 `${d.sTime.split(" ")[1]}~${d.eTime.split(" ")[1]}`),
                        //             td(
                        //                 input({type:"text", class:"label-input", value:`${d.Memo}`, 
                        //                     onkeydown: ({key, target}) => { (key == 'Enter') ? target.blur() : null; },
                        //                     onblur: ({target}) => { updateLabelHandler(target.value, target.parentElement.parentElement); }
                        //                 })
                        //             )
                        //         )
                        //     )
                        // van.add(SensorLabelingEl, SensorLabelingTr());
                        // function set_opt(id_str, sel_str, is_trigger = false) {
                        //     let sel = document.querySelector(id_str);
                        //     const arr = Array.from(sel.options);
                        //     arr.map((l,i) => (l.value.includes(sel_str)) ? sel.selectedIndex = i : "")
                        //     if(is_trigger) sel.dispatchEvent(new Event('change'));
                        // }
                        // <<< 240726 hjkim - BOP 센서 라벨링 데이터 갱신
                        // >>> 240726 hjkim - BOP 센서 라벨링 데이터 수정
                        // function updateLabelHandler(_value, _el) {
                        //     var msg_obj = {};
                        //     msg_obj.msg = "CH2/(1)EVENT_CSV";
                        //     msg_obj.cmd = "UPDATE";
                        //     msg_obj.sdate = _el.getAttribute("stime");
                        //     msg_obj.edate = _el.getAttribute("etime");
                        //     msg_obj.label = _value;
                        //     channel1.port2.postMessage(msg_obj);
                        // }
                        // <<< 240726 hjkim - BOP 센서 라벨링 데이터 수정

                        break;
                }
            } else if(e.data.status.indexOf("FAIL") == 0) {
                switch(e.data.status) {
                    case "FAIL_ADD":
                        // alert("레이블링 추가에 실패했습니다."); mjkoo 주석
                        break;
                    default:
                        // alert("레이블링 통신에 실패했습니다."); mjkoo 주석
                        break;
                }
            }
        break;
        // <<< 240723 hjkim - 센서 레이블 데이터 가져오기
        // >>> 240724 hjkim - 센서 테이블 갱신하기
        case "CH2/(b)SENSOR_TABLE":
            window.datatable_keys = Object.keys(e.data.tabledata[0]);
            window.datatable_data = e.data.tabledata;
        break;
        // <<< 240724 hjkim - 센서 테이블 갱신하기
        // >>> 240724 hjkim - 정상 레이블 데이터 가져오기
        case "CH2/(c)NORMAL_LABEL":
            if(e.data.status.indexOf("SUCCESS") == 0) {
                switch(e.data.status) {
                    case "SUCCESS_DEL":
                    case "SUCCESS_DEL_RANGE":
                    case "SUCCESS_ADD":
                        let obj = JSON.parse(JSON.stringify(window.ch2_1_msg_obj));
                        obj.type = "NORMAL";
                        channel1.port2.postMessage(obj);
                        break;
                    case "SUCCESS_GET":
                    default:
                        // >>> 240724 hjkim - BOP 정상학습 데이터 갱신
                        const NormalEl = document.querySelector("#bop-learning-data-table tbody.scrollmini.overflow-auto");
                        NormalEl.innerHTML = "";
                        const {tr, td, input} = van.tags;
                        const NormalTr = () => 
                            e.data.eventdata.map(d =>
                                tr({stime:`${d.sTime}`, etime:`${d.eTime}`},
                                    td(input({type:"checkbox"})),
                                    td(`${d.sTime}~${d.eTime}`)
                                )
                            )
                        van.add(NormalEl, NormalTr());
                        // <<< 240724 hjkim - BOP 정상학습 데이터 갱신
                        break;
                }
            } else if(e.data.status.indexOf("FAIL") == 0) {
                switch(e.data.status) {
                    case "FAIL_ADD":
                        // alert("레이블링 추가에 실패했습니다.");
                        break;
                    default:
                        // alert("레이블링 통신에 실패했습니다.");
                        break;
                }
            }
        break;
        // <<< 240724 hjkim - 정상 레이블 데이터 가져오기
    }
}



// if(location.pathname.includes("dev/stack.html")) {
if(is_title("스택진단")) {
    worker.postMessage({ msg: "INIT_CHANNEL2"}, [channel2.port1]);
    // 나머지는 imp.js 로 이전
}

if(is_title("BOP진단")) {
    /* -------------------------------------------------------------------------- */
    /*                                MAIN SEQUENCE                               */
    /* -------------------------------------------------------------------------- */
    window.addEventListener("load", () => {
        // >>> 240924 hjkim - 데이터 테이블 바인딩
        let data_table_btn_el = document.querySelector(".HW-bop-senser-monitoring .widget-body .chart-filter-widget .btn-wrapper .btn-of");
        data_table_btn_el.addEventListener("click", () => {
            let data_table_el = document.querySelector("#csv-modal .dialog-container .modal-body table");
            RenderDataTable(data_table_el, window.datatable_keys, window.datatable_data); 
        });
        // <<< 240924 hjkim - 데이터 테이블 바인딩

        // >>> 240927 hjkim - 범례 초기화 버그
        const soft_legend_select_all = () => Array.from(document.querySelectorAll("#soft-sensor-list .tree-ui details input")).map(el => el.checked = true);
        const hard_legend_select_all = () => Array.from(document.querySelectorAll("#hw-bop-sensor-list .tree-ui ul input")).map(el => el.checked = true);
        const soft_legend_deselect_all = () => Array.from(document.querySelectorAll("#soft-sensor-list .tree-ui details input")).map(el => el.checked = false);
        const hard_legend_deselect_all = () => Array.from(document.querySelectorAll("#hw-bop-sensor-list .tree-ui ul input")).map(el => el.checked = false);
        // <<< 240927 hjkim - 범례 초기화 버그
        // >>> 241025 hjkim - 그룹체크 버그 수정
        soft_legend_select_all();
        hard_legend_select_all();
        // <<< 241025 hjkim - 그룹체크 버그 수정
        // >>> 250306 hjkim - 범례 모두선택 / 모두해제
        function init_legend_toggle_btn() {
            const check_all = document.querySelector(".widget.HW-bop-senser-list .widget-head-gadget .mini:nth-child(1)");
            const except_all = document.querySelector(".widget.HW-bop-senser-list .widget-head-gadget .mini:nth-child(2)");
            const check_all2 = document.querySelector(".widget.soft-senser-list .widget-head-gadget .mini:nth-child(1)");
            const except_all2 = document.querySelector(".widget.soft-senser-list .widget-head-gadget .mini:nth-child(2)");
            check_all2.addEventListener("click", () => { soft_legend_select_all(); all_graph("on", g_graph_soft); });
            check_all.addEventListener("click",  () => { hard_legend_select_all(); all_graph("on", g_graph_inst); });
            except_all2.addEventListener("click", () => { soft_legend_deselect_all(); all_graph("off", g_graph_soft); });
            except_all.addEventListener("click",  () => { hard_legend_deselect_all(); all_graph("off", g_graph_inst); });
        }
        init_legend_toggle_btn();
        // <<< 250306 hjkim - 범례 모두선택 / 모두해제
    });

    // >>> 240722 hjkim - 그래프 드래그의 시간 데이터
    /* -------------------------------------------------------------------------- */
    /*                                FUNCTION SET                                */
    /* -------------------------------------------------------------------------- */
    function zero_pad(n) { return (n < 10) ? "0" + n : n; }
    function unix2yms(_ts) {
        let _d = new Date(_ts);
        return `${_d.getFullYear()}-${zero_pad(_d.getMonth()+1)}-${zero_pad(_d.getDate())}`;
    }
    function unix2hms(_ts) {
        let _d = new Date(_ts);
        return `${zero_pad(_d.getHours())}:${zero_pad(_d.getMinutes())}:${zero_pad(_d.getSeconds())}`;
    }
    function ymshms2unix(_str) {
        let _ts = new Date(_str).getTime();
        return _ts;
    }
    
    // >>> 240730 hjkim - 범위 입력 UI
    const range_from = van.state(0);
    const range_to = van.state(0);
    const range_from_date = van.state(0);
    const RangeDateSpan = () => span({class: "date-div"}, () => { range_from_date.val = unix2yms(range_from.val); return `${unix2yms(range_from.val)}`; });
    const RangeFromInput = () => input(
        { id: "start_t"
        , value: () => unix2hms(range_from.val)
        , onchange: ({target}) => range_input_onchange_handler(target.value, range_from) 
        }
    );
    const RangeToInput = () => input(
        { id: "end_t"
        , value: () => unix2hms(range_to.val)
        , onchange: ({target}) => range_input_onchange_handler(target.value, range_to)
        }
    );
    function range_input_onchange_handler(_str, _state) {
        _state.val = ymshms2unix(`${range_from_date.val} ${_str}`);
        // >>> 240808 hjkim - INPUT 수정시 선택범위 수정
        const xaxis = window.g_graph_inst.getXAxes()[0];
        let _x = xaxis.p2c(range_from.val);
        let _y = xaxis.p2c(range_to.val);
        window.g_graph_inst.setSelection({
            xaxis: { from: _x, to: _y }
        });
        // <<< 240808 hjkim - INPUT 수정시 선택범위 수정
    }
    function set_selected_label(_from, _to) {
        // let _el = document.querySelector(".selected-box");
        //     _el.innerHTML = `<span class="date-div">${unix2yms(_from)}</span> ${unix2hms(_from)}~${unix2hms(_to)}`;
        let placeholder = document.querySelector(".selected-box");
        if(range_from.val == 0 && range_to.val == 0) {
            placeholder.innerHTML = "";
            range_from.val = _from;
            van.add(placeholder, RangeDateSpan(_from));
            van.add(placeholder, RangeFromInput());
            van.add(placeholder, RangeToInput());
        }
        range_from.val = _from; range_to.val = _to; 
    }
    // <<< 240730 hjkim - 범위 입력 UI

    function RenderDataTable(_table_el, _keys, _data) {
        _data = _data.reverse();
        // console.log("!@#$ _data : ", _data, _data.splice(0, 100) );
        window.DATA_TABLE_DONE = false; // 데이터 갱신 완료 플래그 
        // >>> 240725 hjkim - 데이터 테이블 보기
        /* ------------------------------- 대상 ELEMENT ------------------------------- */
        _table_el.innerHTML = "";
        // const SideBarEl = document.querySelector("dialog#csv-modal-2 #fixed-table.fixed-table-with-side aside.fixed-table-sidebar.full table")
        // const DataTableEl = document.querySelector("dialog#csv-modal-2 #fixed-table.fixed-table-with-side .fixed-table-body.scrollmini.scrollmini-noborder.full table");
        // SideBarEl.innerHTML = "";
        // DataTableEl.innerHTML = "";
        /* ------------------------------- 대상 ELEMENT ------------------------------- */
        /* ---------------------------------- 상태변수 ---------------------------------- */
        const idx = van.state(0);
        const limit_row = van.state(100);
        const {thead, tbody, th, tr, td} = van.tags;
        /* --------------------------------- 테이블 헤더 --------------------------------- */
        const TableHeader = () => thead(
            tr(
                _keys.map(k => th(k))
            )
        );
        van.add(_table_el, TableHeader());
        /* --------------------------------- 테이블 헤더 --------------------------------- */
        /* ---------------------------------- 상태변수 ---------------------------------- */
        /* ------------------------------ 테이블 좌측 컬럼 2개 ------------------------------ */
        // const SideBar = () => tbody(
        //     _data.slice(idx.val, idx.val + limit_row.val)
        //     .map(d => tr(
        //         _keys.map(k => {
        //             if(k == "Time" || k == "Date") {
        //                 return td(d[k]);
        //             }
        //         })
        //     ))
        // );
        // van.add(_table_el, SideBar());
        /* ------------------------------ 테이블 좌측 컬럼 2개 ------------------------------ */
        /* --------------------------------- 테이블 본문 --------------------------------- */
        const DataTable = () => tbody(
            {class:"scrollmini overflow-auto"},
            _data.slice(idx.val, idx.val + limit_row.val)
            .map(d => tr(
                _keys.map(k => {
                    // if(k != "Time" && k != "Date") {
                        return td(d[k]);
                    // }
                })
            ))
        );
        van.add(_table_el, DataTable());
        /* --------------------------------- 테이블 본문 --------------------------------- */
        /* ---------------------------- 상태 UPDATE시 페이지변경 ---------------------------- */
        van.derive(() => {
            window.DATA_TABLE_DONE = false; // 데이터 갱신 완료 플래그 
            idx.val; limit_row.val;
            // SideBarEl.innerHTML = "";
            // DataTableEl.innerHTML = "";
            // van.add(SideBarEl, SideBar());
            // van.add(DataTableEl, DataTable());
            window.DATA_TABLE_DONE = true; // 데이터 갱신 완료 플래그 
        });
        /* ---------------------------- 상태 UPDATE시 페이지변경 ---------------------------- */
        /* ---------------------------- 이전/다음 페이지 버튼 핸들러 ---------------------------- */
        // window.PrevPageHandler = () => {
        //     window.DATA_TABLE_DONE = false; // 데이터 갱신 완료 플래그 
        //     if(idx.val <= 0) { alert("첫페이지입니다."); idx.val = 0; return; }
        //     idx.val-=limit_row.val; 
        // }
        // window.NextPageHandler = () => {
        //     window.DATA_TABLE_DONE = false; // 데이터 갱신 완료 플래그 
        //     if((_data.length % limit_row.val) != 0 && (_data.length - idx.val) <= (_data.length % limit_row.val)) { alert("마지막페이지입니다."); return; }
        //     if((_data.length % limit_row.val) == 0 && idx.val == (_data.lenth - limit_row.val)) { alert("마지막페이지입니다."); return; }
        //     idx.val+=limit_row.val; 
        // }
        /* ---------------------------- 이전/다음 페이지 버튼 핸들러 ---------------------------- */
        /* ----------------------------- 데이터 내보내기 버튼 핸들러 ---------------------------- */
        function dataExportHandler() {
            let csv_body = "";
            for(let i = 0; i < _data.length; i+= 1) {
                let col = [];
                for(let j = 0; j < _keys.length; j+= 1) { col.push(_data[i][_keys[j]]); }
                csv_body+= col.join(",") + "\n";
            }
            const csv = _keys.join(",") + "\n" + csv_body;
            const blob = new Blob([csv], { type: 'text/plain' }); // Blob 객체 생성 (MIME 타입은 text/plain)
            const link = document.createElement('a'); // 다운로드 링크 생성
            link.href = URL.createObjectURL(blob);
            link.download = 'datatable' + new Date().getTime() + ".csv"; // 파일 이름 지정
            link.click(); // 링크를 클릭하여 파일 다운로드 트리거
            URL.revokeObjectURL(link.href); // URL 객체 해제 (메모리 누수 방지)
        }
        const data_export_btn = document.querySelector("#csv-modal .modal-footer .btn-of");
        data_export_btn.addEventListener("click", dataExportHandler);
        /* ----------------------------- 데이터 내보내기 버튼 핸들러 ---------------------------- */
        // <<< 240725 hjkim - 데이터 테이블 보기
        window.DATA_TABLE_DONE = true; // 데이터 갱신 완료 플래그 
    }
    // <<< 240722 hjkim - 그래프 드래그의 시간 데이터

    // >>> 240724 hjkim - BOP 센서 라벨링 페이지네이션 히든 처리
    // document.querySelector(".widget.bop-senser-labeling-data nav.pagination-wrap").style.visibility = "hidden";
    // document.querySelector(".widget.bop-data-learning nav.pagination-wrap").style.visibility = "hidden";
    // <<< 240724 hjkim - BOP 센서 라벨링 페이지네이션 히든 처리

    /* -------------------------------------------------------------------------- */
    /*                         BOP 센서 & 정상 학습 라벨링 데이터 추가버튼           */
    /* -------------------------------------------------------------------------- */
    // >>> 240722 hjkim - BOP 센서 라벨링 데이터 추가버튼
    // let _add_btn_el = document.querySelector(".widget.bop-senser-labeling-data .btn-of.selected");
    // let _add_btn_el2 = document.querySelector(".widget.bop-data-learning .btn-of.selected");
    // _add_btn_el.addEventListener("click", () => { add_handler(); });
    // _add_btn_el2.addEventListener("click", () => { add_handler("NORMAL"); });
    // function add_handler(_type) {
    //     var sel = g_graph_inst.getSelection();
    //     if(sel == null) {
    //         alert("선택된 그래프 영역이 없습니다.");
    //         return;
    //     }
    //     // >>> 240724 hjkim - BOP 센서 라벨링 데이터 추가 커맨드
    //     /* 
    //     * [CH2/(1)EVENT_CSV] --<cmd=ADD>--> [CH2/(a)SENSOR_LABEL] --
    //     *   --<status:SUCCESS_ADD>--> [CH1/(4)BOP_DATA_FETCH]
    //     */
    //     let msg_obj = {};
    //     msg_obj.msg = "CH2/(1)EVENT_CSV";
    //     msg_obj.cmd = "ADD";
    //     if(_type) { msg_obj.type = _type; }
    //     msg_obj.sdate = `${unix2yms(sel.xaxis.from)} ${unix2hms(sel.xaxis.from)}`;
    //     msg_obj.edate = `${unix2yms(sel.xaxis.to)} ${unix2hms(sel.xaxis.to)}`;
    //     channel1.port2.postMessage(msg_obj);
    //     // <<< 240724 hjkim - BOP 센서 라벨링 데이터 추가 커맨드
    // }
    // db에서도 삭제하는 함수와 충돌하여 일단 주석처리 아니면 그래프가 다 안나와서 오류로 mjkoo
    // <<< 240722 hjkim - BOP 센서 라벨링 데이터 추가버튼
    /* -------------------------------------------------------------------------- */
    /*                         BOP 센서 & 정상 학습 라벨링 데이터 삭제버튼           */
    /* -------------------------------------------------------------------------- */
    // >>> 240724 hjkim - BOP 센서 라벨링 데이터 삭제버튼
    // let _del_btn_el = document.querySelector(".widget.bop-senser-labeling-data .btn-of:not(.selected)");
    // let _del_btn_el2 = document.querySelector(".widget.bop-data-learning .btn-of:not(.selected)");
    // _del_btn_el.addEventListener("click", () => { 
    //     var chkbox_el_list = document.querySelectorAll(".widget.bop-senser-labeling-data input[type='checkbox']");
    //     del_henalder(chkbox_el_list); 
    // });
    // _del_btn_el2.addEventListener("click", () => { 
    //     var chkbox_el_list = document.querySelectorAll(".widget.bop-data-learning input[type='checkbox']");
    //     del_henalder(chkbox_el_list, "NORMAL"); 
    // });
    // function del_henalder(chkbox_el_list, _type) {
    //     var sel = g_graph_inst.getSelection();
        
    //     // TODO: 체크박스 목록 가져오기
    //     let is_checked = false;
    //     let tr_el_list = [];
    //     let checked_idx = [];
        
    //     for(let i = 0; i < chkbox_el_list.length; i+= 1) {
    //         is_checked |= chkbox_el_list[i].checked;
    //         tr_el_list.push(chkbox_el_list[i].parentElement.parentElement);
    //         if(chkbox_el_list[i].checked) {
    //             checked_idx.push(i);
    //         }
    //     }

    //     if(is_checked) {
    //         let yn = confirm("선택된 체크박스 항목을 삭제하시겠습니까?");
    //         if(yn) {
    //             if(checked_idx.length == 1) {
    //                 // 1개 삭제하기
    //                 let el = tr_el_list[checked_idx[0]];
    //                 /*
    //                 * [CH2/(1)EVENT_CSV] --<cmd=DEL>--> [CH2/(a)SENSOR_LABEL] --
    //                 *   --<status:SUCCESS_DEL>--> [CH1/(4)BOP_DATA_FETCH]
    //                 */
    //                 let msg_obj = {};
    //                 msg_obj.msg = "CH2/(1)EVENT_CSV";
    //                 if(checked_idx[0] == 0) {
    //                     msg_obj.cmd = "DEL_RANGE";
    //                     if(_type) { msg_obj.type = _type; }
    //                     msg_obj.sdate = window.ch2_1_msg_obj.sdate;
    //                     msg_obj.edate = window.ch2_1_msg_obj.edate;
    //                 } else {
    //                     msg_obj.cmd = "DEL";
    //                     if(_type) { msg_obj.type = _type; }
    //                     msg_obj.sdate = el.getAttribute("stime");
    //                     msg_obj.edate = el.getAttribute("etime");
    //                 }
    //                 channel1.port2.postMessage(msg_obj);
    //             } else {
    //                 // n개 삭제하기
    //                 var t = 0;
    //                 checked_idx.forEach(i => {
    //                     setTimeout(() => {
    //                         let el = tr_el_list[i];
    //                         /*
    //                         * [CH2/(1)EVENT_CSV] --<cmd=DEL>--> [CH2/(a)SENSOR_LABEL] --
    //                         *   --<status:SUCCESS_DEL>--> [CH1/(4)BOP_DATA_FETCH]
    //                         */
    //                         let msg_obj = {};
    //                         msg_obj.msg = "CH2/(1)EVENT_CSV";
    //                         msg_obj.cmd = "DEL";
    //                         if(_type) { msg_obj.type = _type; }
    //                         msg_obj.sdate = el.getAttribute("stime");
    //                         msg_obj.edate = el.getAttribute("etime");
    //                         channel1.port2.postMessage(msg_obj);
    //                     }, t);
    //                     t+= 500;
    //                 });
    //             }
    //         }
    //     } else if(sel != null) {
    //         // TODO: 선택 영역의 레이블 삭제하기
    //     } else {
    //         alert("선택된 체크박스나 선택된 그래프 영역이 없습니다.");
    //     }
    // }
    // <<< 240724 hjkim - BOP 센서 라벨링 데이터 삭제버튼
    /* -------------------------------------------------------------------------- */
    /*                              BOP 센서 라벨링 데이터 검색                     */
    /* -------------------------------------------------------------------------- */
    // >>> 240726 hjkim - BOP 센서 라벨링 데이터 검색엔터
    // let _search_input_el = document.querySelector(".widget.bop-senser-labeling-data .float-end .text-input");
    // _search_input_el.addEventListener("keydown", ({ key }) => {
    //     if(key == 'Enter') { search_handler(); }
    // })
    // <<< 240726 hjkim - BOP 센서 라벨링 데이터 검색엔터
    
    // >>> 240724 hjkim - BOP 센서 라벨링 데이터 검색버튼
    // let _search_btn_el = document.querySelector(".widget.bop-senser-labeling-data .float-end .btn-of");
    // _search_btn_el.addEventListener("click", search_handler);
    // function search_handler() {
    //     let input_el = document.querySelector(".widget.bop-senser-labeling-data .float-end .text-input");
    //     let word = input_el.value;
    //     /* 
    //     * [CH2/(1)EVENT_CSV] --<cmd=SEARCH>--> [CH2/(a)SENSOR_LABEL] --
    //     *   --<status:SUCCESS_SEARCH>--> [CH1/(4)BOP_DATA_FETCH]
    //     */
    //     let msg_obj = {};
    //     msg_obj.msg = "CH2/(1)EVENT_CSV";
    //     msg_obj.cmd = "SEARCH";
    //     msg_obj.label = word;
    //     channel1.port2.postMessage(msg_obj);
    // }
    // <<< 240724 hjkim - BOP 센서 라벨링 데이터 검색버튼
    /* -------------------------------------------------------------------------- */
    /*                                BOP 정상 학습 데이터 위젯                    */
    /* -------------------------------------------------------------------------- */
    // >>> 240724 hjkim - 정상 레이블 데이터 가져오기
    // window.ch2_1_msg_obj = {};
    // window.ch2_1_msg_obj.msg = "CH2/(1)EVENT_CSV";
    // window.ch2_1_msg_obj.cmd = "GET";
    // window.ch2_1_msg_obj.type = "NORMAL";
    // window.ch2_1_msg_obj.sdate = `2022-01-01 00:00:00`;
    // window.ch2_1_msg_obj.edate = `${unix2yms(new Date().getTime())} 23:59:00`;
    // channel1.port2.postMessage(window.ch2_1_msg_obj);
    // <<< 240724 hjkim - 정상 레이블 데이터 가져오기

    /* -------------------------------------------------------------------------- */
    /*                               BOP 진단 슬라이딩 윈도우                       */
    /* -------------------------------------------------------------------------- */
    // >>> 240722 hjkim - ELEMENT INIT
    SlidingWindowInput = () => span("Window: ",
        input({id: "wsize", type: "number", style: "width:50px;",
            value: () => (get_cookie("wsize") == "") ? 20 : get_cookie("wsize"), 
            onchange: ({target}) => {
                set_cookie("wsize", target.value, 99);
                window.wsize = target.value;
                // 서버에 전송
                let msg_obj = {};
                msg_obj.msg = "CH1/(4)BOP_DATA_FETCH";
                msg_obj.url = (() => { const s = load_calendex_state(); return [BASE_DATA_URI(), s[0], s[1], s[2], s[3]].join(""); })();
                msg_obj.imp_url = "/ALL/data/impedance/imp_data/";
                msg_obj.window_size = parseInt(target.value);
                msg_obj.debug = "L3527";
                channel1.port2.postMessage(msg_obj);
            }
        })
    );
    document.querySelector(".btn-wrapper").prepend(SlidingWindowInput());
    // <<< 240722 hjkim - ELEMENT INIT
}

// >>> 240403 hjkim - FDC 캘린덱스 쿠키로 저장
function save_calendex_state() {
	const yearly = g_el.yearly.value;
	const monthly = g_el.monthly.value;
	const daily = g_el.daily.value;
	const timely = g_el.timely.value;
	set_cookie("FDC_calendex_yearly", yearly, CALENDEX_COOKIE_EXPIRE);
	set_cookie("FDC_calendex_monthly", monthly, CALENDEX_COOKIE_EXPIRE);
	set_cookie("FDC_calendex_daily", daily, CALENDEX_COOKIE_EXPIRE);
	set_cookie("FDC_calendex_timely", timely, CALENDEX_COOKIE_EXPIRE);
	return [ get_cookie("FDC_calendex_yearly"), get_cookie("FDC_calendex_monthly"), get_cookie("FDC_calendex_daily"), get_cookie("FDC_calendex_timely") ];
}

function load_calendex_state() {
	if(get_cookie("FDC_calendex_yearly") == "" 
	|| get_cookie("FDC_calendex_monthly") == ""
	|| get_cookie("FDC_calendex_daily") == ""
	|| get_cookie("FDC_calendex_timely") == "") return false;
	return [ get_cookie("FDC_calendex_yearly"), get_cookie("FDC_calendex_monthly"), get_cookie("FDC_calendex_daily"), get_cookie("FDC_calendex_timely") ];
}

window.BE_CALLED = {};
function retry(condition, interval, limit, fn_callback) {
    var RETRY_CNT = 0;
    let id = new Date().getTime()+(Math.random());
    window.BE_CALLED[id] = false;
    var _retry_id = setInterval((_id) => {
        // if((RETRY_CNT % 10) == 0) console.log("!@#$ retry : ", _id, condition, RETRY_CNT, eval(condition), window.BE_CALLED[_id] == false);
        // console.log("!@#$ retry : ", _id, condition, RETRY_CNT, eval(condition), window.BE_CALLED[_id] == false);
        if(eval(condition) && window.BE_CALLED[_id] == false) {
            window.BE_CALLED[_id] = true; RETRY_CNT = limit; fn_callback(); 
        } 
        if(RETRY_CNT > limit) { clearInterval(_retry_id); }
        RETRY_CNT++;
    }, interval, id);
}

window.g_applying_calendex_state = false;
function apply_calendex_state() {
	retry(`window.g_applying_calendex_state == false`, 10, 100, () => {
		
        window.g_applying_calendex_state = true;
        var r = load_calendex_state();
        if(r == false) return r;
        var _saved_value = r;

        const change_event = new Event("change");
        g_el.yearly.value = _saved_value[0];
        g_el.yearly.dispatchEvent(change_event);

        retry(`g_el.monthly.value != '' && g_el.monthly.value != '-1'`, 10, 100, () => {
        //var change_event = new Event('change');
        g_el.monthly.value = _saved_value[1];
        g_el.monthly.dispatchEvent(change_event);
            retry(`g_el.daily.value != '' && g_el.daily.value != '-1'`, 10, 100, () => {
            //var change_event = new Event('change');
            g_el.daily.value = _saved_value[2];
            g_el.daily.dispatchEvent(change_event);
                retry(`g_el.timely.value != '' && g_el.timely.value != '-1'`, 10, 100, () => {
                //var change_event = new Event('change');
                g_el.timely.value = _saved_value[3];
                g_el.timely.dispatchEvent(change_event);
                window.g_applying_calendex_state = false;
                });
            });
        });
	});
}

// <<< 240403 hjkim - FDC 캘린덱스 쿠키로 저장

// 줌 상태 저장
function saveZoomState(graphType) {
    if (graphType === "BOP진단") {
        // g_graph_soft의 y축 상태 저장
        const softGraphZoomState = {
            yMin: g_graph_soft.getOptions().yaxes[0].min,
            yMax: g_graph_soft.getOptions().yaxes[0].max
        };
        sessionStorage.setItem("softGraphZoomState", JSON.stringify(softGraphZoomState));
    } else if (graphType === "대시보드") {
        // g_graph_inst의 y축 상태 저장
        const instGraphZoomState = {
            yMin: g_graph_inst.getYAxes()[0].options.min,
            yMax: g_graph_inst.getYAxes()[0].options.max
        };
        sessionStorage.setItem("instGraphZoomState", JSON.stringify(instGraphZoomState));
    }
}

// 줌 상태 복원
function restoreZoomState(graphType) {
    if (graphType === "BOP진단") {
        const savedState = sessionStorage.getItem("softGraphZoomState");
        if (savedState) {
            const zoomState = JSON.parse(savedState);
            const opt = g_graph_soft.getOptions();
            opt.yaxes[0].min = zoomState.yMin;
            opt.yaxes[0].max = zoomState.yMax;
            $.plot(document.querySelector(".sw_sensor_graph"), g_graph_soft.getData(), opt);
        }
    } else if (graphType === "대시보드") {
        const savedState = sessionStorage.getItem("instGraphZoomState");
        if (savedState) {
            const zoomState = JSON.parse(savedState);
            g_graph_inst.getYAxes().map(function (axis) {
                axis.options.min = zoomState.yMin;
                axis.options.max = zoomState.yMax;
            });
            g_graph_inst.setupGrid();
            g_graph_inst.draw();
        }
    }
}

// 줌 아웃
function zoom_out() {
    if (is_title("대시보드")) {
        g_graph_inst.getYAxes().map(function (axis) {
            var opts = axis.options;
            opts.max *= 2;  // y축 아웃
            opts.min *= 2;  // y축 아웃
        });
        saveZoomState("대시보드");  // 줌 상태 저장
        g_graph_inst.setupGrid();
        g_graph_inst.draw();
        g_graph_inst.clearSelection();
    }
    if (is_title("BOP진단")) {
        var opt = g_graph_soft.getOptions(); 
        opt.yaxes[0].max *= 2;  // y축 아웃
        opt.yaxes[0].min *= 2;  // y축 아웃
        saveZoomState("BOP진단");  // 줌 상태 저장
        $.plot(document.querySelector(".sw_sensor_graph"), g_graph_soft.getData(), opt); 
    }
}

// 줌 인
function zoom_in() { 
    if (is_title("대시보드")) {
        const sel = g_graph_inst.getSelection();
        if (sel == null) alert("그래프 범위를 선택하세요.");
        g_graph_inst.getYAxes().map(function (axis) {
            var opts = axis.options;
            opts.min /= 2;  // y축 인
            opts.max /= 2;    // y축 인
        });
        saveZoomState("대시보드");  // 줌 상태 저장
        g_graph_inst.setupGrid();
        g_graph_inst.draw();
        g_graph_inst.clearSelection();
    }
    if (is_title("BOP진단")) {
        var opt = g_graph_soft.getOptions();
        opt.yaxes[0].min /= 2;  // y축 인
        opt.yaxes[0].max /= 2;    // y축 인
        saveZoomState("BOP진단");  // 줌 상태 저장
        $.plot(document.querySelector(".sw_sensor_graph"), g_graph_soft.getData(), opt); 
    }
}

function init_dashboard_onload() {
    worker.postMessage({ msg: "INIT_CHANNEL1", url: BASE_DATA_URI()}, [channel1.port1]);
    worker.postMessage({ msg: "INIT_CHANNEL3"}, [channel3.port1]);
	var _state = load_calendex_state();
    if (_state == false) {
        // 
        // CH1/(1)DASHBOARD_INIT ---> CH1/(a)DASHBOARD_DATA
        // 
        channel1.port2.postMessage({ msg: "CH1/(1)DASHBOARD_INIT", url: BASE_DATA_URI()});
    } else {
        // 
        // CH1/(2)GET_DIR ---> CH1/(b)YEARLY_REFRESH
        //                |--> CH1/(c)MONTHLY_REFRESH
        //                |--> CH1/(d)DAILY_REFRESH
        //                `--> CH1/(e)TIMELY_REFRESH
        // 
        GET_ASYNC_STACK_EL((stack_el) => {
            channel1.port2.postMessage({ msg: "CH1/(2)GET_DIR", response: "CH1/(b)YEARLY_REFRESH",  url: BASE_DATA_URI() });
            channel1.port2.postMessage({ msg: "CH1/(2)GET_DIR", response: "CH1/(c)MONTHLY_REFRESH", url: [BASE_DATA_URI(), _state[0]].join("") });
            channel1.port2.postMessage({ msg: "CH1/(2)GET_DIR", response: "CH1/(d)DAILY_REFRESH",   url: [BASE_DATA_URI(), _state[0], _state[1]].join("") });
            channel1.port2.postMessage({ msg: "CH1/(2)GET_DIR", response: "CH1/(e)TIMELY_REFRESH",  url: [BASE_DATA_URI(), _state[0], _state[1], _state[2]].join("") });
            // 
            window.g_data_url = [BASE_DATA_URI(), _state.join("")].join("");
            retry(`Calendex._fn_init_graph != null`, 10, 100, () => {
                Calendex._fn_init_graph();
            });
        });
    }

    // >>> 241128 hjkim - 스택 엘리먼트 동기화
	console.log("GET_ASYNC_STACK_EL L4121 BEFORE");
    GET_ASYNC_STACK_EL((stack_el) => {
		console.log("GET_ASYNC_STACK_EL L4121");
        stack_el.addEventListener("change", () => {
			console.log("GET_ASYNC_STACK_EL onchange : L4122");
            clear_calendex_cookie();
            channel1.port2.postMessage({ msg: "CH1/(1)DASHBOARD_INIT", url: BASE_DATA_URI()});
            // channel1.port2.postMessage({msg: "CH1/(4)BOP_DATA_FETCH", url: _url, imp_url: "/ALL/data/impedance/imp_data/" });
        });
    });
    // <<< 241128 hjkim - 스택 엘리먼트 동기화
}

function init_bop_onload() {
    // if(location.pathname.includes("dev/bop.html")) {
    if(is_title("BOP진단")) {
        worker.postMessage({ msg: "INIT_CHANNEL1"}, [channel1.port1]);
        worker.postMessage({ msg: "INIT_CHANNEL3"}, [channel3.port1]);
        var _state = load_calendex_state();
        if (_state == false) {
            // CH1/(3)BOP_INIT ---> CH1/(f)BOP_DATA ---> CH1/(4)BOP_DATA_FETCH ---> CH1/(g)BOP_SOFT_FLOTDATA
            //                                                                 |--> CH1/(h)BOP_HARD_FLOTDATA
            //                                                                 |--> CH1/(i)BOP_BARDATA
            //                                                                 `--> CH1/(j)STACK_BARDATA
            channel1.port2.postMessage({ msg: "CH1/(3)BOP_INIT", url: BASE_DATA_URI()});
        } else {
            // 
            // CH1/(2)GET_DIR ---> CH1/(b)YEARLY_REFRESH
            //                |--> CH1/(c)MONTHLY_REFRESH
            //                |--> CH1/(d)DAILY_REFRESH
            //                `--> CH1/(e)TIMELY_REFRESH
            // 
            GET_ASYNC_STACK_EL((stack_el) => {
                channel1.port2.postMessage({ msg: "CH1/(2)GET_DIR", response: "CH1/(b)YEARLY_REFRESH",  url: BASE_DATA_URI() });
                channel1.port2.postMessage({ msg: "CH1/(2)GET_DIR", response: "CH1/(c)MONTHLY_REFRESH", url: [BASE_DATA_URI(), _state[0]].join("") });
                channel1.port2.postMessage({ msg: "CH1/(2)GET_DIR", response: "CH1/(d)DAILY_REFRESH",   url: [BASE_DATA_URI(), _state[0], _state[1]].join("") });
                channel1.port2.postMessage({ msg: "CH1/(2)GET_DIR", response: "CH1/(e)TIMELY_REFRESH",  url: [BASE_DATA_URI(), _state[0], _state[1], _state[2]].join("") });
                const _url = [BASE_DATA_URI(), _state[0], _state[1], _state[2], _state[3]].join("");
                var wsize = (get_cookie("wsize") == "" || get_cookie("wsize") == undefined) ? document.querySelector("#wsize").value : get_cookie("wsize");
                channel1.port2.postMessage({
                    msg: "CH1/(4)BOP_DATA_FETCH", 
                    url: _url, 
                    imp_url: "/ALL/data/impedance/imp_data/", 
                    window_size: parseInt(wsize),
                    // >>> 241101 hjkim - 
                    is_result: false,
                    // <<< 241101 hjkim - 
                    debug: "L3676"
                });
            });
        }

        // >>> 241128 hjkim - 스택 엘리먼트 동기화
        GET_ASYNC_STACK_EL((stack_el) => {
            stack_el.addEventListener("change", () => {
                clear_calendex_cookie();
                channel1.port2.postMessage({ msg: "CH1/(3)BOP_INIT", url: BASE_DATA_URI()});
            });
        });
        // <<< 241128 hjkim - 스택 엘리먼트 동기화

        // >>> 240827 hjkim - 전류A 삭제
        document.querySelector(".widget.soft-senser-monitoring .widget-body h3").remove();
        // <<< 240827 hjkim - 전류A 삭제
    }
}

/* -------------------------------------------------------------------------- */
/*                                 AI TRAINING                                */
/* -------------------------------------------------------------------------- */
if(is_title("AI 학습")) {
    /* -------------------------------------------------------------------------- */
    /*                                  CONST SET                                 */
    /* -------------------------------------------------------------------------- */
    /* --------------------------------- FIELDS --------------------------------- */
    const VALID_FIELDS = ["Date","Time","T_A_B_in(116)","T_A_m_out(110)","T_A_S_in(113)","T_A_S_out(109)","T_A_vent(115)","T_F_S_in(112)","T_F_S_out(111)","T_DI_h_out(107)","T_DI_S_in(114)","T_DI_S_out(108)","T_w_h_out(103)","T_w_t_in(101)","T_w_t_out(102)","blank1","blank2","P_A_B_in(105)","P_A_m_out(102)","P_A_S_in(101)","P_A_S_out(104)","P_F_S_in(103)","P_DI_p_in(4)","P_DI_p_out(5)","P_w_h_out(6)","P_w_p_in(1)","P_w_p_out(2)","MFC1(H2)","MFC2(N2)","MFM3(Air)","MFM2(DI)","MFM1(Water)","Air(%)","DI(%)","Water(%)","DI_Conductivity","Current","Voltage","T_w_h_in(104)","Result","deltaP","UA","Ms","Mr","R_Water_R1","R_Water_R2","R_Water_R3","R_Air_deltaP","R_Air_U","R_Air_P1","R_Air_V","R_heat","R_Ms","R_Mr","R_DI","R_WP"];
    const DEFAULT_FIELDS_FOR_ERR    = ["R_Air_deltaP", "R_Air_U"];
    const UNION_FIELDS_FOR_ERR      = ["R_Air_deltaP", "R_Air_U", "R_Air_V", "R_Water_R1", "R_Water_R2", "R_Water_R3", "R_Mr", "R_WP", "R_Ms", "R_DI", "R_heat"];
    /* -------------------------- PLACEHOLDER ELEMENTS -------------------------- */
    const el = {
        calendex:   document.querySelector(".widget.HW-senser-list .widget-head .widget-head-gadget"),
        tab:        document.querySelector(".widget.HW-senser-list .widget-head .sub-tab"),
        sidecard:   document.querySelector(".widget.HW-senser-list .widget-body div:nth-child(1)"),
        graph:      document.querySelector(".widget.HW-senser-list .widget-body div:nth-child(2)"),
        widgetbody: document.querySelector(".widget.HW-senser-list .widget-body"),
        model:      document.querySelector("#model-group-select"), // 모델 변경
		// >>> 250114 hjkim - 
        //stack:      document.querySelector("#stack-select"), // 스택변경
		stack:      document.querySelector("#fuelcell-select"), // 스택변경
		// <<< 250114 hjkim - 
    };
    const calendex_el = () => document.querySelector("calendex-in-ai");
    const flot_el = () => document.querySelector("flot-in-ai");
    const sidecard_el = () => document.querySelector("sidecard-in-ai");
    window.MODEL_NAME = () => { return document.querySelector("#model-group-select").value; };
    /* ------------------------------- EVENT FLAG ------------------------------- */
    const WIRING_001 = window.EVENT_WIRING_001 = "AITRAINING/CALENDEX";
    const WIRING_002 = window.EVENT_WIRING_002 = "AITRAINING/SIDECARD";
    const WIRING_003 = window.EVENT_WIRING_003 = "AITRAINING/TABS";
    const WIRING_001_ACTION_001 = "GRAPH1/INIT";
    const WIRING_002_ACTION_001 = "TABS/UPDATE";
    const WIRING_002_ACTION_002 = "GRAPH1/DRAW_HIGHLOW";
    const WIRING_003_ACTION_001 = "SIDECARD/UPDATE";
    
    /* -------------------------------------------------------------------------- */
    /*                                MAIN SEQUENCE                               */
    /* -------------------------------------------------------------------------- */
    /* ------------------------------ INIT CHANNEL1 ----------------------------- */
    worker.postMessage({ msg: "INIT_CHANNEL1", url: BASE_DATA_URI()}, [channel1.port1]);

    /* ------------------------------ INIT CALENDEX ----------------------------- */
    let d = new Date();
    let yyyy = zero_pad(d.getFullYear()), mm = zero_pad(d.getMonth()+1), dd = zero_pad(d.getDate());
    init_calendex_1(`/data/${STACK_NAME()}/BOP/${yyyy}/${mm}/${dd}/${STACK_NAME()}_${yyyy}${mm}${dd}.csv`, event = WIRING_001);
    /* ------------------------------ INIT SIDECARD ----------------------------- */
    window.addEventListener("load", () => {
        init_tab_for_fields();
        // el.sidecard.innerHTML = `<sidecard-in-ai fullpath=${fullpath_aiparam} error-code=${1} column-name="R_Air_deltaP" event-name=${WIRING_002}>`;
        retry(`MODEL_NAME() != ""`, 500, 10, () => {
            init_sidecard_for_aiparam(el.sidecard, STACK_NAME(), MODEL_NAME());
        });

        /* -------------------------------- TEMP CODE(graph2) ------------------------------- */
        // 그래프 요소 갱신
        // retry(`MODEL_NAME().trim() != ""`, 500, 10, () => {
        //     let _fullpath = `/data/${STACK_NAME()}/BOP/MODEL/${MODEL_NAME()}/deltaP.csv`;
        //     init_aitraining_graph_2(_fullpath);
        // });
        // CHANGE 이벤트 핸들러
        init_model_change_handler();
        /* -------------------------------- TEMP CODE(graph2) ------------------------------- */
    });

    function init_model_change_handler() {
        el.model.addEventListener("change", ({target}) => {
            init_aitraining_graph_2(`/data/${STACK_NAME()}/BOP/MODEL/${MODEL_NAME()}/deltaP.csv`);
			// >>> 250114 hjkim - 
            //const fullpath_aiparam = `/data/${STACK_NAME()}/BOP/MODEL/${MODEL_NAME()}/AIParam_v2.json`;
			const fullpath_aiparam = `/data/SE01/${STACK_NAME()}/BOP/MODEL/${MODEL_NAME()}/AIParam_v2.json`;
			// <<< 250114 hjkim - 
            fetch(fullpath_aiparam)
            .then(res => {
                if(res.status == 200) return res.json();
                else { console.error(`${fullpath_aiparam} 의 응답코드는 ${res.status} 입니다.`); return undefined; }
            })
            .then(json => {
                if(json == undefined) return;
                update_sidecard_for_aiparam(json);
            });
        });
        
        el.stack.addEventListener("change", ({target}) => {
            setTimeout(() => 
                init_aitraining_graph_2(`/data/${STACK_NAME()}/BOP/MODEL/${MODEL_NAME()}/deltaP.csv`)
            , 50);
            // 
            el.sidecard.innerHTML = "";
            init_sidecard_for_aiparam(el.sidecard, STACK_NAME(), MODEL_NAME());
        });
    }

    /* --------------------------------- VAN.JS --------------------------------- */
    function init_tab_for_fields() {
        /* ------------------------------- NULL CHECK ------------------------------- */
        /* ------------------------------- NULL CHECK ------------------------------- */
        const {ul, li, a} = van.tags;
        window.TABS = van.state(DEFAULT_FIELDS_FOR_ERR);
        window.TAB_ON = van.state(TABS.val[0]);
        const TabEl = (_TABS, _TAB_ON) => () => ul( {tabs: ()=> _TABS.val, tab_on: () => _TAB_ON.val}, 
            TabList(_TABS, _TAB_ON)
        );
        const TabList = (_TABS, _TAB_ON) => _TABS.val.map( (t_name) => 
            li({class: "tab-item"}, 
                a({ class: () => (t_name == _TAB_ON.val) ? "active" : "", 
                    onclick : () => { tab_on_handler(t_name) } }, t_name)
            )
        );
        // van.derive(() => { TAB_ON.val = TABS.val[0]; console.log("!@#$ derive / TABS.val : ", TABS.val); });
        el.tab.innerHTML = "";
        van.add(el.tab, TabEl(window.TABS, window.TAB_ON));
    }
    
    function tab_on_handler(_selected_field) {
        window.TAB_ON.val = _selected_field; // TAB_UI UPDATE        
        // SIDECARD UI UPDATE
        window.sidecard_selected.val =  _selected_field; 
        if(window.sidecard_json.val[window.sidecard_errorcode.val][_selected_field] == undefined) {
            alert("에러코드 정보가 없습니다."); return false; 
        }
        window.sidecard_sel_arr.val = window.sidecard_json.val[window.sidecard_errorcode.val][_selected_field]; // 필드값 갱신
        // FLOT UI UPDATE
        _flot_minmax_update();
        flot_el().show_only(_selected_field);       // !!!상태가 있음. 순서가 중요. minmax 다음
    }

    function update_sidecard_for_aiparam(json) {
        let _errorcode = window.sidecard_errorcode.val;
        let _obj = json[_errorcode];
        let _err = Object.keys(json);
        let _key = Object.keys(_obj);
        let d = _obj[_key[0]];

        window.sidecard_json.val        = json;
        window.sidecard_errorcode.val   = _errorcode;
        window.sidecard_selected.val    = _key[0];
        window.sidecard_keys.val        = _key;
        window.sidecard_sel_arr.val     = d;

        let _min_idx = window.get_label_idx(window.sidecard_json.val.config.header, "min");
        let _max_idx = window.get_label_idx(window.sidecard_json.val.config.header, "max");
        let _min = window.sidecard_sel_arr.val[_min_idx];
        let _max = window.sidecard_sel_arr.val[_max_idx];
    }

    function _flot_minmax_update() {
        let _min_idx = window.get_label_idx(window.sidecard_json.val.config.header, "min");
        let _max_idx = window.get_label_idx(window.sidecard_json.val.config.header, "max");
        let _min = window.sidecard_sel_arr.val[_min_idx];
        let _max = window.sidecard_sel_arr.val[_max_idx];
        flot_el().setAttribute("min", _min);
        flot_el().setAttribute("max", _max);
    }
    function init_sidecard_for_aiparam(_placeholder, _stackname, _modelname, _errorcode=1) {
        /* ------------------------------- NULL CHECK ------------------------------- */
        if(_placeholder == null || _placeholder == undefined) { console.error("_placeholder 인자가 잘못되었습니다."); return false; }
        if(!is_string(_stackname) || _stackname == "") { console.error("_stackname 인자가 잘못되었습니다."); return false; }
        if(!is_string(_modelname) || _modelname == "") { console.error("_modelname 인자가 잘못되었습니다."); return false; }
        if(!is_number(_errorcode)) { console.error("_errorcode 인자가 잘못되었습니다."); return false; }
        /* ------------------------------- NULL CHECK ------------------------------- */
        const SELECT_LABEL = ["0은 없음",
            "01. MFM 전 누설",
            "02. MFM 후 누설",
            "03. 블로워",
            "04. 유량센서",
            "05. 압력센서",
            "06. 가습기",
            "07. 스택 입구 온도센서(물)",
            "08. 스택 출구 온도센서(물)",
            "09. 열교환기",
            "10. 1차 냉각수 펌프",
            "11. 2차 냉각수 펌프",
            "12. 스택 입구 온도센서(열)",
            "13. 스택 출구 온도센서(열)",
            "14. 열교환기 출구 온도센서",
        ];
        const fullpath_aiparam = `/data/${_stackname}/BOP/MODEL/${_modelname}/AIParam_v2.json`;
        /* --------------------------------- SENDER --------------------------------- */
        channel1.port2.postMessage({
            msg: "CH1/(6)SIMPLE_FETCH",
            response: `CH1/${fullpath_aiparam}`,
            url: fullpath_aiparam,
        });
        /* -------------------------------- RECEIVER -------------------------------- */
        channel1.port2.addEventListener("message", (e) => {
            if(e.data.msg == `CH1/${fullpath_aiparam}`) {
                sidecard_json_handler(e.data.json);
            }
        });
        function sidecard_json_handler(json) {
            // { "1": { "R_Air_deltaP": [1.0, -1.0, 4.0, 0.0, 0.59],
            //          "R_Air_U": [2.0, 4.0, 5.0, 0.0, 0.32] },
            //   ...
            // }
            let _obj = json[_errorcode];
            let _err = Object.keys(json).filter(k => k != "config");
            let _key = Object.keys(_obj);
            let d = _obj[_key[0]];
            /* --------------------------------- VAN.JS --------------------------------- */
            const SIDECARD_METRIC_LABEL     = json.config.label_kr;
            const SIDECARD_METRIC_EDITABLE  = json.config.editable;
            window.get_label_idx = (_header, _label) => { 
                for(let i = 0; i < _header.length; i+= 1) {
                    if(_header[i] == _label) return i;
                } return -1;
            };
            const {div, select, option, table, tr, td, input, br, button} = van.tags;
            window.sidecard_json        = van.state(json);
            window.sidecard_errorcode   = van.state(_errorcode);
            window.sidecard_selected    = van.state(_key[0]);
            window.sidecard_keys        = van.state(_key);
            window.sidecard_sel_arr     = van.state(d);
            // 
            const SideCardEl = () => div(
                // span(() => `에러코드 : ${sidecard_errorcode.val}`), br(),
                // span(() => `선택자 : ${sidecard_selected.val}`), br(),
                // span(() => `키 : ${sidecard_keys.val}`), br(),
                select( {disabled: false, style:"width:120px", onchange: sidecard_sel_handler1}, 
                    _err.map(err_no => option( {value: err_no, selected: () => (err_no==sidecard_errorcode.val)}, SELECT_LABEL[err_no] ))), 
                br(),
                () => select( {style:"width:120px", onchange: sidecard_sel_handler2}, OptionEl(sidecard_keys.val)),
                br(),
                () => TableEl(window.sidecard_sel_arr.val, SIDECARD_METRIC_LABEL, SIDECARD_METRIC_EDITABLE),
                br(),
                button({class:"btn-of", style:"float:right;", onclick: sidecard_apply}, "적용")
            );
            // 
            const OptionEl = (__keys) => __keys.map(k => option( {value: k, selected: () => (k==sidecard_selected.val )}, k));
            const TableEl = (__sel_arr, __label, __editable) => table(
                __label.map((l, idx) => tr(
                    td(l), 
                    td(
                        input({ type:"number", style: "width:35px", 
                            value:()=>__sel_arr[idx],
                            disabled: !__editable[idx], name: l, 
                            onchange: ({target}) => { sidecard_metric_handler(target, idx); }}
                        )
                    )
                ))
            );
            _placeholder.innerHTML = "";
            window.sidecard = van.add(_placeholder, SideCardEl());

            function sidecard_metric_handler(_target, _idx) { // input 필드 변경 핸들러
                let _err = window.sidecard_errorcode.val;
                let _col = window.sidecard_selected.val;
                // SIDECARD DATA UPDATE
                window.sidecard_sel_arr.val[_idx] = _target.value;
                window.sidecard_json.val[_err][_col][_idx] = _target.value;
                
                // FLOT UPDATE
                if( _idx == get_label_idx(window.sidecard_json.val.config.header, "min") ) {
                    flot_el().setAttribute("min", _target.value);
                }
                if( _idx == get_label_idx(window.sidecard_json.val.config.header, "max") ) {
                    flot_el().setAttribute("max", _target.value);
                }
            }

            function sidecard_sel_handler1({target}) { // 에러코드 변경 핸들러
                if(target.value == "에러코드") return false;
                
                // SIDECARD UPDATE
                window.sidecard_errorcode.val = target.value;
                let _key = Object.keys(window.sidecard_json.val[target.value]) || []; 
                window.sidecard_keys.val = _key; // 필드 목록 갱신
                window.sidecard_selected.val = _key[0]; // 필드 선택자 갱신
                window.sidecard_sel_arr.val = window.sidecard_json.val[target.value][_key[0]]; // 필드값 갱신
                
                // BINDING SIDECARD TO TAB
                window.TABS.val = _key;
                window.TAB_ON.val = window.sidecard_selected.val;
                
                // FLOT UPDATE
                _flot_minmax_update();
                flot_el().setAttribute("fields", _key);
            }
            function sidecard_sel_handler2({target}) { // 필드 변경 핸들러
                window.sidecard_selected.val = target.value; // 필드 선택자 갱신
                tab_on_handler(target.value); // 탭 목록 갱신
                window.sidecard_sel_arr.val = window.sidecard_json.val[window.sidecard_errorcode.val][target.value]; // 필드값 갱신

                // FLOT UPDATE
                _flot_minmax_update();
                flot_el().show_only(target.value);  // !!!상태가 있음. 순서가 중요. minmax 다음
            }

            function sidecard_apply() {
                console.log("window.sidecard_json : ", window.sidecard_json.val);
                let _str = JSON.stringify(window.sidecard_json.val);
                let _path = `${STACK_NAME()}/BOP/MODEL/${MODEL_NAME()}/AIParam_v2.json`;
                var R = confirm(`${STACK_NAME()}의 ${MODEL_NAME()}을 변경하시겠습니까?`);
                if(R) {
                    fetch(`http://192.168.100.111:8082/api/ai_config/`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            data : _str,
                            path: _path,
                        }),
                    });
                }
                console.log("!@#$ _path", _str, _path);
            }
        }
    }
    /* ------------------------------ CUSTOM EVENT ------------------------------ */
    window.addEventListener(WIRING_001, ({detail}) => {
        console.log(`!@#$ ${WIRING_001} / detail.msg : `, detail.msg);
        switch(detail.msg) {
            case WIRING_001_ACTION_001:
                if(window.sidecard_json == undefined) {
                    retry("window.sidecard_json != undefined", 500, 5, () => {
                        const _field = Object.keys(window.sidecard_json.val[window.sidecard_errorcode.val]);
                        // const _d = window.sidecard_json.val[window.sidecard_errorcode.val][window.sidecard_selected.val];
                        // 
                        let _min_idx = window.get_label_idx(window.sidecard_json.val.config.header, "min");
                        let _max_idx = window.get_label_idx(window.sidecard_json.val.config.header, "max");
                        let _min = window.sidecard_sel_arr.val[_min_idx];
                        let _max = window.sidecard_sel_arr.val[_max_idx];
                        el.graph.outerHTML = `<flot-in-ai fullpath=${detail.fullpath} fields="${_field}" min="${_min}" max="${_max}">`;
                    });
                } else {
                    flot_el().setAttribute("fullpath", detail.fullpath);
                }
            break;
        }
    });
    window.addEventListener(WIRING_002, ({detail}) => {
        console.log(`!@#$ ${WIRING_002} / detail.msg : `, detail.msg);
        switch(detail.msg) {
            case WIRING_002_ACTION_001:
                TABS.val = detail.tablist;
                TAB_ON.val = TABS.val[0];
            break;
            case WIRING_002_ACTION_002:
                console.log("!@#$ detail : ", detail);
                flot_el().setAttribute("minmaxconstavgstd", [detail.low, detail.high, 0]);
            break;
        }
    });
    window.addEventListener(WIRING_003, ({detail}) => {
        console.log(`!@#$ ${WIRING_003} / detail.msg : `, detail.msg);
        switch(detail.msg) {
            case WIRING_003_ACTION_001:
                sidecard_el().setAttribute("column-name", detail.column);
            break;
        }
    });

    /* -------------------------------- TEMP CODE(Errata) ------------------------------- */
    document.querySelector(".widget.HW-senser-list .widget-head").childNodes[2].textContent = "Soft Sensor List";
    /* -------------------------------- TEMP CODE(Errata) ------------------------------- */
    /* -------------------------------------------------------------------------- */
    /*                                  CLASS SET                                 */
    /* -------------------------------------------------------------------------- */
    class CalendexInAI extends HTMLElement {

        constructor() { // 멤버변수 정의
            super();
            // CONST
            this.RETURN_001 = "CH1/(k)UPDATE_YEARLY_STATE";
            this.RETURN_002 = "CH1/(k)UPDATE_MONTHLY_STATE";
            this.RETURN_003 = "CH1/(k)UPDATE_DAILY_STATE";
            this.RETURN_004 = "CH1/(k)UPDATE_TIMEY_STATE";
            this.id = `id_${new Date().getTime()}`;
        }

        disconnectedCallback() {
            console.log("disconnectedCallback @ CalendexInAI");
        }

        static get observedAttributes() {
            // 변경을 관찰하고자 하는 attribute를 나열한다.
            // 아래 반환값들이 변경되면 `attributeChangedCallback` callback이 호출된다.
            return ['date', 'filename']
        }

        attributeChangedCallback(name, oldVal, newVal) {
            if(oldVal != undefined) { // UPDATED
                // >>> 240928 hjkim -
                console.log(`!@#$ Attribute ${name} has changed. : `, name, oldVal, newVal);
                switch(name) {
                    case "date":
                        this.init_date(newVal.split("-"));
                        this.init_data();
                    break;
                    case "filename":
                        let _arr = newVal.split("/");
                        this.t_sel_state.val = _arr.pop();
                    break;
                }
                // <<< 240928 hjkim - 
            }
        }
        
        connectedCallback() {
            /* ------------------------------- INIT ACTION ------------------------------ */
            this.ACTION_001 = "GRAPH1/INIT";
            /* ---------------------------- PARAM NULL CHECK ---------------------------- */
            let date = this.getAttribute("date");
            let eventname_for_timely = this.getAttribute("event-name");
            if(date == null || date == "" || date.match(/....-..-../) == null) {
                console.error("<calendex-in-ai>의 date 인자가 유효하지 않습니다."); 
                this.remove(); return;
            }
            if(eventname_for_timely == null || eventname_for_timely == "") {
                console.error("<calendex-in-ai>의 event-name 인자가 유효하지 않습니다."); 
                this.remove(); return;
            }
            /* ------------------------------- INIT FLAGS ------------------------------- */
            this.t = this.getAttribute("filename");
            this.init_date(date.split("-"));
            this.eventname_for_timely = eventname_for_timely;
            /* ------------------------------ INIT PROCESS ------------------------------ */
            this.init_DOM();
            this.init_data();
            /* ------------------------- TRIGGER FOR GRAPH INIT ------------------------- */
            this.calendex_handler(this.t, 3);
        }

        update(fullpath) {
            
        }

        init_date(ymd) {
            this.y = ymd[0]+"/";
            this.m = ymd[1]+"/";
            this.d = ymd[2]+"/";
        }

        init_DOM() { // Prerequisite : Van.js library
            // INCLUDES
            const {div, button, span, select, option} = van.tags;
            // STATES
            const yearly_state  = this.yearly_state  = van.state([2024]);
            const monthly_state = this.monthly_state = van.state(Array(12).fill().map((d, i) => i+1));
            const daily_state   = this.daily_state   = van.state(Array(31).fill().map((d, i) => i+1));
            const timely_state  = this.timely_state  = van.state([this.t]);
            const y_selected = this.y_sel_state = van.state(this.y);
            const m_selected = this.m_sel_state = van.state(this.m);
            const d_selected = this.d_sel_state = van.state(this.d);
            const t_selected = this.t_sel_state = van.state(this.t);
            // ELEMENTS
            const MakeOpt = (list, is_sel) => list.map( (item) => option({value: item, selected: ()=>(is_sel==item)}, item));
            const CalendexDiv = (is_window = false, is_zoom = false) => 
                div({class: "btn-wrapper"}, 
                    // span({}, "Window", 
                    //     input({id: "wsize", type: "number", style: "width:50px;"})
                    // ),
                    // button({ontouchstart: zoom_in, onclick: zoom_in, class: "btn-of mid-size w50px"}, 
                    //     span({class: "icon-zoom-in"})
                    // ),
                    // button({ontouchstart: zoom_out, onclick: zoom_out, class: "btn-of mid-size w50px"},
                    //     span({class: "icon-zoom-out"})
                    // ),
                    () => select({onchange: ({target}) => this.calendex_handler(target.value, 0), id:"yearly"}, option({value:-1}, `-년(${yearly_state .val.length}개)-`), MakeOpt(yearly_state.val , y_selected.val)),
                    () => select({onchange: ({target}) => this.calendex_handler(target.value, 1), id:"monthly"},option({value:-1}, `-월(${monthly_state.val.length}개)-`), MakeOpt(monthly_state.val, m_selected.val)),
                    () => select({onchange: ({target}) => this.calendex_handler(target.value, 2), id:"daily"},  option({value:-1}, `-일(${daily_state  .val.length}개)-`), MakeOpt(daily_state.val  , d_selected.val)),
                    () => select({onchange: ({target}) => this.calendex_handler(target.value, 3), id:"timely"}, option({value:-1}, `-시(${timely_state .val.length}개)-`), MakeOpt(timely_state.val , this.t_sel_state.val)),
                );
            // TEST
            // setInterval(() => { monthly_state.val = [...monthly_state.val, 13]; }, 1000);
            // van.derive(() => { 
            //     this.yearly_state; 
            //     this.monthly_state; 
            //     this.daily_state;
            //     this.timely_state;
            //     console.log("!@#$ derive / yearly_state : ", this.yearly_state.val); 
            //     console.log("!@#$ derive / monthly_state : ", this.monthly_state.val); 
            //     console.log("!@#$ derive / daily_state : ", this.daily_state.val); 
            //     console.log("!@#$ derive / timely_state : ", this.timely_state.val); 
            // });
            this.custom_element = CalendexDiv()
            van.add(this, this.custom_element);
        }

        calendex_handler(value, state_enum) {
            console.log("!@#$ calendex_handler / value, state_enum : ", value, state_enum);
            const list = [this.yearly_state, this.monthly_state, this.daily_state, this.timely_state];
            let m = this.monthly_state.val;
            let d = this.daily_state.val;
            let t = this.timely_state.val;
            // state_enum+1의 상태를 갱신한다.
            if(state_enum == 0) {
                this.y_sel_state.val = value;
                let _url = [BASE_DATA_URI(), value].join("");
                channel1.port2.postMessage({ 
                    msg: "CH1/(2)GET_DIR", 
                    response: this.RETURN_002,  
                    url: _url,
                });
            }
            if(state_enum == 1) {
                this.m_sel_state.val = value;
                let _url = [BASE_DATA_URI(), this.y_sel_state.val, value].join("");
                channel1.port2.postMessage({ 
                    msg: "CH1/(2)GET_DIR", 
                    response: this.RETURN_003,  
                    url: _url,
                });
            }
            if(state_enum == 2) {
                this.d_sel_state.val = value;
                let _url = [BASE_DATA_URI(), this.y_sel_state.val, this.m_sel_state.val, value].join("");
                channel1.port2.postMessage({ 
                    msg: "CH1/(2)GET_DIR", 
                    response: this.RETURN_004,  
                    url: _url, 
                });
            }
            // 그래프 파일 FETCH
            if(state_enum == 3) {
                this.t_sel_state.val = value;
                let fullpath = [BASE_DATA_URI(), this.y_sel_state.val, this.m_sel_state.val, this.d_sel_state.val, value].join("");
                let e = new CustomEvent( this.eventname_for_timely, { detail: { msg: this.ACTION_001, fullpath : fullpath }} );
                window.dispatchEvent(e);
            }
        }

        init_data() {
            // >>> 웹워커에 위임
            channel1.port2.postMessage({ msg: "CH1/(2)GET_DIR", response: this.RETURN_001,  url:  BASE_DATA_URI() });
            channel1.port2.postMessage({ msg: "CH1/(2)GET_DIR", response: this.RETURN_002,  url: [BASE_DATA_URI(), this.y].join("") });
            channel1.port2.postMessage({ msg: "CH1/(2)GET_DIR", response: this.RETURN_003,  url: [BASE_DATA_URI(), this.y, this.m].join("") });
            channel1.port2.postMessage({ msg: "CH1/(2)GET_DIR", response: this.RETURN_004,  url: [BASE_DATA_URI(), this.y, this.m, this.d].join("") });
            // <<< 웹워커에 위임
            channel1.port2.addEventListener("message", (e) => {
                // console.log("init_data : ", e);
                if(e.data.msg == this.RETURN_001) { this.yearly_state.val  = e.data.list; this.y_sel_state.val = this.y; }
                if(e.data.msg == this.RETURN_002) { this.monthly_state.val = e.data.list; this.m_sel_state.val = this.m; }
                if(e.data.msg == this.RETURN_003) { this.daily_state.val   = e.data.list; this.d_sel_state.val = this.d; delete this.t; }
                if(e.data.msg == this.RETURN_004) { this.timely_state.val  = e.data.list; this.t_sel_state.val = this.t; }
            });
        }
    }
    class FlotInAI extends HTMLElement {
        // `<flot-in-ai fullpath=${fullpath} fields=${fields} min=${min} max=${max}>`
        static get observedAttributes() { return ['fullpath', 'fields', 'min', "max"]; }
        attributeChangedCallback(name, old_val, new_val) {
            var self = this;
            // console.log(`Attribute ${name} has changed. : `, name, oldVal, newVal);
            if(old_val != undefined) { // UPDATED
                if(old_val == new_val) return;
                console.log(`!@#$ <flot-in-ai> ${name} changed : `, new_val);
                switch(name) {
                    case "fullpath":
                        // FLOT UPDATE
                        this.fullpath = this.getAttribute("fullpath");
                        this.fields = this.getAttribute("fields").split(",");
                        this.fetch_data(this.fullpath, UNION_FIELDS_FOR_ERR, (flotdata) => { 
                            
                            // DRAW GRAPH
                            self.flotdata = flotdata;
                            self.flot_rebuild(flotdata);
                            
                            // FLOT DRAW LINE
                            let _min = self.getAttribute("min");
                            let _max = self.getAttribute("max");
                            self.add_horizontal_line(_min, _max);
                            
                            // SHOW ONLY
                            self.show_only(self.fields[self.sel_col_idx]);
                        });
                    break;

                    case "fields":
                        this.fields = this.getAttribute("fields").split(",");
                        this.show_only(this.fields[this.sel_col_idx]);
                    break;

                    case "min":
                    case "max":
                        // FLOT DRAW LINE
                        let _min = this.getAttribute("min");
                        let _max = this.getAttribute("max");
                        this.add_horizontal_line(_min, _max);
                    break;
                }
            }
        }

        disconnectedCallback() { this.flot.destroy(); }
        
        connectedCallback() {
            /* ------------------------------- INIT FLAGS ------------------------------- */
            var self = this;
            this.style.width            = "100%";
            this.style.height           = "100%";
            this.style.display          = 'block';

            /* ------------------------------- NULL CHECK ------------------------------- */
            var IS_INVALID = false;
            if(is_string(this.getAttribute("fields")) == false) {
                console.error(`${TITLE}의 <flot-in-ai> 에서 fields의 인자가 String이 아닙니다.`);
                IS_INVALID|= true;
            }
            if(IS_INVALID) return;

            /* ------------------------------- INIT MODEL ------------------------------- */
            this.fullpath   = this.getAttribute("fullpath");
            this.fields     = this.getAttribute("fields").split(",");
            this.sel_col_idx = 0;

            // 그래프 초기화
            this.placeholder = this;
            this.default_data = [ { label: "default", data: Array(60).fill().map((d, i) => [new Date().getTime() + (i*1000), 0] ) } ];
            this.lib_load(() => {
                // 그래프 초기화
                self.flot_init();
                // 데이터 패치
                self.fetch_data(self.fullpath, self.fields, (flotdata) => {
                    // DRAW GRAPH
                    self.flotdata = flotdata; 
                    self.flot_rebuild(flotdata); 
                    
                    // FLOT DRAW LINE
                    let _min = self.getAttribute("min");
                    let _max = self.getAttribute("max");
                    self.add_horizontal_line(_min, _max);

                    // SHOW ONLY
                    self.show_only(self.fields[self.sel_col_idx]);
                });
            });
        }
        
        // get_minmaxconstavgstd() {
        //     let _str = this.getAttribute("minmaxconstavgstd");
        //     let _arr = _str.split(",");
        //     return _arr;
        //     // return this.chunk_array(_arr, 5);
        // }

        // chunk_array(arr, chunkSize) {
        //     const result = [];
        //     for (let i = 0; i < arr.length; i += chunkSize) {
        //         result.push(arr.slice(i, i + chunkSize));
        //     }
        //     return result;
        // }


        lib_load(callback) {
            var self = this;
            this.sync_flag = {cnt : 0, max : 5 };
            if(typeof $ == 'undefined' || typeof $['plot'] == 'undefined') {
                fn_load_js(location.origin+"/NEW/flot/color_palette.js", () => {
                    fn_load_js(location.origin+"/NEW/flot/jquery-3.2.1.js", () => {
                        fn_load_js(location.origin+"/NEW/flot/jquery.flot.js", () => {
                            fn_load_js(location.origin+"/NEW/flot/jquery.flot.time.js",          () => { _done(callback); } );
                            fn_load_js(location.origin+"/NEW/flot/jquery.flot.tooltip.js",       () => { _done(callback); } );
                            fn_load_js(location.origin+"/NEW/flot/jquery.flot.crosshair.js",     () => { _done(callback); } );
                            fn_load_js(location.origin+"/NEW/flot/jquery.flot.selection.drag.js",() => { _done(callback); } );
                            fn_load_js(location.origin+"/NEW/flot/jquery.flot.resize.js",        () => { _done(callback); } );
                        });
                    });
                });
            } else {
                this.sync_flag.cnt = this.sync_flag.max;
                _done(callback);
            }

            function _done(callback) {
                // console.log("_done : ", self.sync_flag.cnt, self.sync_flag.max);
                if(++self.sync_flag.cnt >= self.sync_flag.max) { callback(); }
            }
        }

        flot_init() {
            let _data = this.default_data;
            // let _line_opt = g_FlotOption.init_line_opt(_data);
            this.flot = $.plot(this.placeholder, _data, this.get_flot_opt("TIME"));
            this.flot.id = new Date().getTime()+(Math.random());
        }

        flot_rebuild(_data) {
            if(this.flot != undefined) this.flot.destroy();
            this.flot = $.plot(this.placeholder, _data, this.get_flot_opt("TIME"));
        }

        flot_redraw(_data) {
            if(this.flot == undefined) { this.flot_rebuild(_data); } 
            else {
                this.flot.setData(_data);
                this.flot.setupGrid();
                this.flot.draw();
            }
        }
        
        get_flot_opt(type = "NON_TIME") {
            let X1_LABEL = "Time";
            let Y1_LABEL = " ";
            let Y_MIN = -5;
            let Y_MAX = 20;
            var opt = {
                series: { stack: false, lines: { show: true, lineWidth: 1.5 }, shadowSize: 0 },
                legend: { show: false, noColumns: 4 },
                axisLabels: { show: true },
                xaxis: { show: true, position: "bottom", axisLabel: X1_LABEL, /*mode: "time",*/
                    timezone: "browser", tickLength: 0 },
                yaxis: { axisLabel: Y1_LABEL, labelWidth: 30, autoscalMargin: 0.02 },
                yaxes: [
                    { position: "left", axisLabel: Y1_LABEL, show: true, min: Y_MIN, max: Y_MAX,
                    tickFormatter: (v, axis) => (v * 1).toFixed(axis.tickDecimals) + Y1_LABEL },
                ],
                crosshair: { mode: "x", color: "rgba(200, 0, 0, 0.7)", lineWidth: 1 },
                selection: { mode: "x", color: "#00BFFF", minSize: 10 },
                grid: { backgroundColor: "white", clickable: true, hoverable: true, autoHighlight: true,
                    borderColor: { top: "#e8e8e8", right: "#e8e8e8", bottom: "#e8e8e8", left: "#e8e8e8" },
                    margin: { top: 30, right: 10, bottom: 20 },
                    borderWidth: { top: 2, right: 2, bottom: 2, left: 2 }
                },
                tooltip: { show: true, cssClass: "flotTip", /* xDateFormat: "%y-%m-%d %h:%M:%S", */
                    content: (l, x, y, f) => this.tooltip_func(l, x, y, f, this.flot.getData()), 
                }
            };
            if(type == "TIME") opt.xaxis.mode = "time";
            return opt;
        }

        tooltip_func(label, xval, yval, flotItem, data) {
            var html = "<b>▶%x</b><br>";
            var xpos = flotItem.datapoint[0];
            var ypos = flotItem.datapoint[1];
            var timestamp = Math.floor(xpos / 1000) * 1000;
            var adjXpos;
            var i;
            var max;
            // 스플라인을 위한 x축 인덱스 조정.
            for (i = 0, max = data[0].data.length; i < max; i += 1) {
                if (timestamp == data[0].data[i][0]) {
                    adjXpos = i;
                    break;
                }
            }
            // bps 차트 툴팁
            for (i = 0, max = data.length; i < max; i += 1) {
                // if (i === max / 2) {
                //     html += "<hr style='border-top: 1px solid #333; margin: 3px 0px;'></hr>";
                // }
                if(data[i].lines['show'] != true) continue;
                if (flotItem.seriesIndex === i) {
                    // 선택한 시계열 하이라이트 처리
                    html += "<div style='width:4px;height:0;border:5px solid ";
                    html += data[i].color + ";overflow:hidden;display:inline-block;'></div> ";
                    // 레이블 명
                    html += "<b><u>" + data[i].label + ":" + (ypos);
                    // 데이터 값
                    html += "</u></b>" + "<br>";
                } else {
                    html += "<div style='width:4px;height:0;border:5px solid ";
                    html += data[i].color + ";overflow:hidden;display:inline-block;'></div> ";
                    // 레이블 명 : 데이터 값
                    html += data[i].label + ":" + (data[i].data[flotItem.dataIndex][1]);
                    html += "<br>";
                }
            }
            return html;
        }

        fetch_data(fullpath, fields, callback) {
            /* --------------------------------- SENDER --------------------------------- */
            channel1.port2.postMessage({ 
                msg: "CH1/(5)RAW_DATA_FETCH",
                response: `CH1/${fullpath}`,
                column: fields,
                url: fullpath,
                is_time: true,
                debug: "L3992"
            });
            /* -------------------------------- RECEIVER -------------------------------- */
            channel1.port2.addEventListener("message", (e) => {
                if(e.data.msg == `CH1/${fullpath}`) {
                    this.fetched_data = e.data.flotdata;
                    callback(e.data.flotdata);
                }
            })
        }

        show_only(field) {
            var d = this.flot.getData();
            // let field_data = this.fetched_data.filter(d => d.label == field);
            // var field_data = [];
            // for (var idx = 0; idx < this.fetched_data.length; idx++) {
            //     if(this.fetched_data[idx].label == field) field_data.push(this.fetched_data[idx]);
            // }
            // console.log("!@#$ d, this.fetched_data, field_data : ", d, this.fetched_data, field_data);
            for (var idx = 0; idx < d.length; idx++) {
                if(d[idx].label == field) { d[idx].lines.show = true; }
                // else if(d[idx].label == "low" || d[idx].label == "high") 
                // { d[idx].lines.show = true; }
                else { d[idx].lines.show = false; }
            }
            this.flot.draw();
        }
        // >>> 240910 hjkim - 추가됨
        add_horizontal_line(_min, _max) {
            const MAX_IS_RED = "#FF0000";
            const MIN_IS_BLACK = "#000000";
            // >>> 240923 hjkim - 상하한을 markings로 바꿈
            let _opt = this.flot.getOptions();
            let _min_mark = { yaxis: { from: _min, to: _min}, color: MIN_IS_BLACK};
            let _max_mark = { yaxis: { from: _max, to: _max}, color: MAX_IS_RED};
            _opt.grid.markings = [_max_mark, _min_mark];
            this.flot.draw();
            // <<< 240923 hjkim - 상하한을 markings로 바꿈

            // if(_data.length == 0) return [];
            // let _arr_len = _data[0].data.length;
            // let _line_data = Array(_arr_len).fill([0, 0]).map((d, idx) => { return [idx, _value]});
            // let _color = _label == "high" ? "#46A5CA" : "#4FBE5E";
            // let _series    = { label: _label, color: _color, data: _line_data};

            // var _is_init = true;
            // for(let i = 0; i < _data.length; i+= 1) {
            //     if(_data[i] == undefined) continue;
            //     if(_data[i].label == _label) { _data[i].data = _line_data; _is_init = false; }
            // }
            // if(_is_init) { _data.push(_series); }
            // return _data;
        }
        // <<< 240910 hjkim - 추가됨
    }
    class FlotInAI2 extends HTMLElement {
        // <flot-in-ai2 fullpath=${fullpath} fields=${fields}>
        static get observedAttributes() { return ["fullpath", "fields"]; }
        attributeChangedCallback(name, old_val, new_val) {
            var self = this;
            if(old_val != undefined) {
                if(old_val == new_val) return;
                console.log(`!@#$ <flot-in-ai2> ${name} changed : `, new_val);
                switch(name) {
                    case "fullpath":
                        // FLOT UPDATE
                        this.fullpath = this.getAttribute("fullpath");
                        this.fields = this.getAttribute("fields").split(",");
                        this.fetch_data(this.fullpath, UNION_FIELDS_FOR_ERR, (flotdata) => { 
                            
                            // DRAW GRAPH
                            self.flotdata = flotdata;
                            self.flot_rebuild(flotdata);
                            
                            // SHOW ONLY
                            self.show_only(self.fields);
                        });
                    break;

                    case "fields":
                        this.fields = this.getAttribute("fields").split(",");
                        this.show_only(this.fields);
                    break;
                }
            }
        }

        disconnectedCallback() { this.flot.destroy(); }

        connectedCallback() {
            /* ------------------------------- INIT FLAGS ------------------------------- */
            var self = this;
            this.style.width            = "100%";
            this.style.height           = "100%";
            this.style.display          = 'block';

            /* ------------------------------- NULL CHECK ------------------------------- */
            var IS_INVALID = false;
            if(is_string(this.getAttribute("fields")) == false) {
                console.error(`${TITLE}의 <flot-in-ai> 에서 fields의 인자가 String이 아닙니다.`);
                IS_INVALID|= true;
            }
            if(IS_INVALID) return;

            /* ------------------------------- INIT MODEL ------------------------------- */
            this.fullpath   = this.getAttribute("fullpath");
            this.fields     = this.getAttribute("fields").split(",");

            // 그래프 초기화
            this.placeholder = this;
            this.default_data = [ { label: "default", data: Array(60).fill().map((d, i) => [new Date().getTime() + (i*1000), 0] ) } ];
            this.lib_load(() => {
                // 그래프 초기화
                self.flot_init();
                // 데이터 패치
                self.fetch_data(self.fullpath, self.fields, (flotdata) => {
                    // DRAW GRAPH
                    self.flotdata = flotdata; 
                    self.flot_rebuild(flotdata); 
                    
                    // SHOW ONLY
                    self.show_only(self.fields);
                });
            });
        }

        lib_load(callback) {
            var self = this;
            this.sync_flag = {cnt : 0, max : 5 };
            if(typeof $ == 'undefined' || typeof $['plot'] == 'undefined') {
                fn_load_js(location.origin+"/NEW/flot/color_palette.js", () => {
                    fn_load_js(location.origin+"/NEW/flot/jquery-3.2.1.js", () => {
                        fn_load_js(location.origin+"/NEW/flot/jquery.flot.js", () => {
                            fn_load_js(location.origin+"/NEW/flot/jquery.flot.time.js",          () => { _done(callback); } );
                            fn_load_js(location.origin+"/NEW/flot/jquery.flot.tooltip.js",       () => { _done(callback); } );
                            fn_load_js(location.origin+"/NEW/flot/jquery.flot.crosshair.js",     () => { _done(callback); } );
                            fn_load_js(location.origin+"/NEW/flot/jquery.flot.selection.drag.js",() => { _done(callback); } );
                            fn_load_js(location.origin+"/NEW/flot/jquery.flot.resize.js",        () => { _done(callback); } );
                        });
                    });
                });
            } else {
                this.sync_flag.cnt = this.sync_flag.max;
                _done(callback);
            }

            function _done(callback) {
                // console.log("_done : ", self.sync_flag.cnt, self.sync_flag.max);
                if(++self.sync_flag.cnt >= self.sync_flag.max) { callback(); }
            }
        }

        flot_init() {
            let _data = this.default_data;
            this.flot = $.plot(this.placeholder, _data, this.get_flot_opt("TIME"));
            this.flot.id = new Date().getTime()+(Math.random());
        }

        flot_rebuild(_data) {
            if(this.flot != undefined) this.flot.destroy();
            this.flot = $.plot(this.placeholder, _data, this.get_flot_opt("TIME"));
        }

        flot_redraw(_data) {
            if(this.flot == undefined) { this.flot_rebuild(_data); } 
            else {
                this.flot.setData(_data);
                this.flot.setupGrid();
                this.flot.draw();
            }
        }

        get_flot_opt(type = "NON_TIME") {
            let X1_LABEL = "Time";
            let Y1_LABEL = " ";
            let Y_MIN = -5;
            let Y_MAX = 20;
            var opt = {
                series: { stack: false, lines: { show: true, lineWidth: 1.5 }, shadowSize: 0 },
                legend: { show: false, noColumns: 4 },
                axisLabels: { show: true },
                xaxis: { show: true, position: "bottom", axisLabel: X1_LABEL, /*mode: "time",*/
                    timezone: "browser", tickLength: 0 },
                yaxis: { axisLabel: Y1_LABEL, labelWidth: 30, autoscalMargin: 0.02 },
                yaxes: [
                    { position: "left", axisLabel: Y1_LABEL, show: true, /*min: Y_MIN, max: Y_MAX,*/
                    tickFormatter: (v, axis) => (v * 1).toFixed(axis.tickDecimals) + Y1_LABEL },
                ],
                crosshair: { mode: "x", color: "rgba(200, 0, 0, 0.7)", lineWidth: 1 },
                selection: { mode: "x", color: "#00BFFF", minSize: 10 },
                grid: { backgroundColor: "white", clickable: true, hoverable: true, autoHighlight: true,
                    borderColor: { top: "#e8e8e8", right: "#e8e8e8", bottom: "#e8e8e8", left: "#e8e8e8" },
                    margin: { top: 30, right: 10, bottom: 20 },
                    borderWidth: { top: 2, right: 2, bottom: 2, left: 2 }
                },
                tooltip: { show: true, cssClass: "flotTip", /* xDateFormat: "%y-%m-%d %h:%M:%S", */
                    content: (l, x, y, f) => this.tooltip_func(l, x, y, f, this.flot.getData()), 
                }
            };
            if(type == "TIME") opt.xaxis.mode = "time";
            return opt;
        }

        tooltip_func(label, xval, yval, flotItem, data) {
            var html = "<b>▶%x</b><br>";
            var xpos = flotItem.datapoint[0];
            var ypos = flotItem.datapoint[1];
            var timestamp = Math.floor(xpos / 1000) * 1000;
            var adjXpos;
            var i;
            var max;
            // 스플라인을 위한 x축 인덱스 조정.
            for (i = 0, max = data[0].data.length; i < max; i += 1) {
                if (timestamp == data[0].data[i][0]) {
                    adjXpos = i;
                    break;
                }
            }
            // bps 차트 툴팁
            for (i = 0, max = data.length; i < max; i += 1) {
                // if (i === max / 2) {
                //     html += "<hr style='border-top: 1px solid #333; margin: 3px 0px;'></hr>";
                // }
                if(data[i].lines['show'] != true) continue;
                if (flotItem.seriesIndex === i) {
                    // 선택한 시계열 하이라이트 처리
                    html += "<div style='width:4px;height:0;border:5px solid ";
                    html += data[i].color + ";overflow:hidden;display:inline-block;'></div> ";
                    // 레이블 명
                    html += "<b><u>" + data[i].label + ":" + (ypos);
                    // 데이터 값
                    html += "</u></b>" + "<br>";
                } else {
                    html += "<div style='width:4px;height:0;border:5px solid ";
                    html += data[i].color + ";overflow:hidden;display:inline-block;'></div> ";
                    // 레이블 명 : 데이터 값
                    html += data[i].label + ":" + (data[i].data[flotItem.dataIndex][1]);
                    html += "<br>";
                }
            }
            return html;
        }

        fetch_data(fullpath, fields, callback) {
            /* --------------------------------- SENDER --------------------------------- */
            channel1.port2.postMessage({ 
                msg: "CH1/(5)RAW_DATA_FETCH_ALL", 
                response: `CH1/${fullpath}`,
                url: fullpath,
                is_time: false,
                debug: "L3992"
            });
            /* -------------------------------- RECEIVER -------------------------------- */
            channel1.port2.addEventListener("message", (e) => {
                if(e.data.msg == `CH1/${fullpath}`) {
                    this.header = e.data.header;
                    this.fetched_data = e.data.flotdata;
                    callback(e.data.flotdata);
                }
            })
        }

        show_only(_field) {
            if(is_array(_field) == false) { console.error(`fields(${_field})가 array가 아닙니다.`); return; }
            var d = this.flot.getData();
            // console.table(_field);
            // for(let i = 0; i < _field.length; i++) { console.table(d[ _field[i] ].lines); }
            for(let idx = 0; idx < d.length; idx++){ d[idx].lines.show = false; }
            for(let i = 0; i < _field.length; i++) { d[ _field[i] ].lines.show = true; }
            // for(let i = 0; i < _field.length; i++) { console.table(d[ _field[i] ].lines); }
            this.flot.draw();
        }
    }
    class SideCardInAI extends HTMLElement {
        // <sidecard-in-ai fullpath=${fullpath} error-code=${errorcode} column-name=${column} $event-name=${eventname}>
        static get observedAttributes() {
            return ["fullpath", "error-code", "column-name"];
        }

        attributeChangedCallback(name, old_val, new_val) {
            var self = this;
            if(old_val != undefined) { // = UPDATED
                if(old_val == new_val) return;
                console.log(`!@#$ sidecard-in-ai ${name} changed : `, new_val);
                switch(name) {
                    case "fullpath":
                        this.init_data(new_val);
                    break;
                    case "error-code":
                        let col = this.getAttribute("column-name");
                        this.AI_PARAM_HIGH.val = this.aiparam[new_val][col].high;
                        this.AI_PARAM_LOW.val  = this.aiparam[new_val][col].low;
                        this.AI_PARAM_STD.val  = this.aiparam[new_val][col].std;
                        this.AI_PARAM_AVG.val  = this.aiparam[new_val][col].avg;
                        this.AI_PARAM_CON.val  = this.aiparam[new_val][col].const;
                    break;
                    case "column-name":
                        let err = this.getAttribute("error-code");
                        this.AI_PARAM_HIGH.val = this.aiparam[err][new_val].high;
                        this.AI_PARAM_LOW.val  = this.aiparam[err][new_val].low;
                        this.AI_PARAM_STD.val  = this.aiparam[err][new_val].std;
                        this.AI_PARAM_AVG.val  = this.aiparam[err][new_val].avg;
                        this.AI_PARAM_CON.val  = this.aiparam[err][new_val].const;
                    break;
                }
            }
        }

        connectedCallback() {
            /* ------------------------------- INIT ACTION ------------------------------ */
            this.ACTION_001 = "TABS/UPDATE";
            this.ACTION_002 = "GRAPH1/DRAW_HIGHLOW";
            /* ------------------------------- INIT FLAGS ------------------------------- */
            this.fullpath = this.getAttribute("fullpath");
            this.errorcode = this.getAttribute("error-code") || 0;
            this.eventname = this.getAttribute("event-name");
            this.column = this.getAttribute("column-name");
            /* ------------------------------ INIT UI STATE ----------------------------- */
            this.AI_PARAM_HIGH = van.state(99);
            this.AI_PARAM_LOW = van.state(0);
            this.AI_PARAM_STD = van.state(0.5);
            this.AI_PARAM_AVG = van.state(45);
            this.AI_PARAM_CON = van.state(1.2);
            /* ------------------------------ INIT PROCESS ------------------------------ */
            this.init_DOM(this.eventname);
            this.init_data(this.fullpath);
        }
        /* -------------------------------------------------------------------------- */
        /*                                 METHOD SET                                 */
        /* -------------------------------------------------------------------------- */
        get_event_liset() {
            console.log("EVENT NAME : ", this.eventname);
            console.log("ACTION LIST: ", this.ACTION_001);
            console.log("ACTION LIST: ", this.ACTION_002);
        }
        init_DOM(eventname) {
            function errorcode_handler (_value, self) {
                let _aiparam = self.aiparam, _ACTION_001 = self.ACTION_001;
                self.setAttribute("error-code", _value);
                let fields = Object.keys(_aiparam[_value]);
                let e = new CustomEvent(eventname, { detail : { msg : _ACTION_001, tablist: fields }});
                window.dispatchEvent(e);
            }
            const {div, dl, dt, dd, button, select, option} = van.tags;
            const SideCard = () => [
                // select( {class: "graph1_errorcode", onchange: ({target}) => errorcode_handler(target.value, this)},
                //     Array(14).fill().map( (d, i) => option({value: `${i+1}`}, `에러코드 ${i+1}`) )
                // ),
                dl(
                    dt( span({}), "상수"),
                    dd( input({type: "number", style: "width: 35px", value: () => this.AI_PARAM_CON.val,
                        onchange: ({target}) => { this.AI_PARAM_CONST.val = target.value; }
                        })
                    )
                ),
                dl(
                    dt( span({class: "max-arrow-svg svg-box mx-2"}), "상한"), 
                    dd( input({type: "number", style: "width: 35px", value: () => this.AI_PARAM_HIGH.val,
                        onchange: ({target}) => { this.AI_PARAM_HIGH.val = target.value; 
                            let e = new CustomEvent(eventname, { detail : { msg : this.ACTION_002, high: this.AI_PARAM_HIGH.val, low : this.AI_PARAM_LOW.val}});
                            window.dispatchEvent(e);
                            }
                        })
                    ) 
                ),
                dl(
                    dt( span({class: "min-arrow-svg svg-box mx-2"}), "하한"),
                    dd( input({type: "number", style: "width: 35px", 
                        value: () => this.AI_PARAM_LOW.val,
                        onchange: ({target}) => { this.AI_PARAM_LOW.val = target.value; }
                    }))
                ),
                dl(dt("STD 편차"), dd(() => this.AI_PARAM_STD.val) ),
                dl(dt("AVG 편차"), dd(() => this.AI_PARAM_AVG.val) ),
                button({class: "btn-of float-end", 
                    onclick: () => {
                        alert("적용");
                        // console.log("!@#$ this.ACTION_002 : ", this.ACTION_002);
                        // console.log("!@#$ this.aiparam : ", this.aiparam);
                        // let _obj = this.aiparam[this.getAttribute("error-code")][this.getAttribute("column-name")];
                        // if(_obj == undefined) { alert("해당 상 하한 값이 없습니다."); return false; } 
                        // // let e = new CustomEvent(eventname, { detail : { msg : this.ACTION_002, high: _obj.high, low : _obj.low}});
                        // let e = new CustomEvent(eventname, { detail : { msg : this.ACTION_002, high: this.AI_PARAM_HIGH.val, low : this.AI_PARAM_LOW.val}});
                        // console.log("!@#$ e : ", e);
                        // window.dispatchEvent(e);
                    }
                }, "적용")
            ];
            van.derive(() => { this.AI_PARAM_HIGH.val; console.log("!@#$ derive / AI_PARAM_HIGH.val : ", this.AI_PARAM_HIGH.val); });
            van.add(sidecard_el(), SideCard());
        }

        init_data(fullpath) {
            fetch(fullpath).then(res => res.json()).then(json => {
                this.aiparam = json;
                const fields = Object.keys(json[this.errorcode]);
                /* ------------------------------- EARLY EXIT ------------------------------- */
                if(fields.length == 0) { console.error(`AI Params에서 에러코드(${this.errorcode}) 해당 값이 없습니다.`); return false; }
                /* ---------------------------- UPDATE SIDE CARD ---------------------------- */
                let err = this.getAttribute("error-code");
                this.AI_PARAM_HIGH.val = json[err][fields[0]].high;
                this.AI_PARAM_LOW.val  = json[err][fields[0]].low;
                this.AI_PARAM_STD.val  = json[err][fields[0]].std;
                this.AI_PARAM_AVG.val  = json[err][fields[0]].avg;
                this.AI_PARAM_CON.val  = json[err][fields[0]].const;
            });
        }
    }
    /* --------------------------- INIT CUSTOM ELEMENT -------------------------- */
    customElements.define("calendex-in-ai", CalendexInAI);
    customElements.define("flot-in-ai", FlotInAI);
    customElements.define("flot-in-ai2", FlotInAI2);
    customElements.define("sidecard-in-ai", SideCardInAI);
    /* -------------------------------------------------------------------------- */
    /*                                FUNCTION SET                                */
    /* -------------------------------------------------------------------------- */
    function fn_load_js(src_url        , cb_init            ) {	
        var my_head = document.getElementsByTagName('head')[0];
        var my_js = document.createElement('script');
        my_js.type= 'text/javascript';
        my_js.async = true;
        my_js.src = src_url;
        if(cb_init !== null) my_js.onload = function (){if(typeof cb_init == "function"){cb_init();} };
        my_head.appendChild(my_js);
    }

    function init_aitraining_graph_1(_fullpath="/data/F002/BOP/2024/08/22/F002_20240822.csv", _모델이름="F002_model", _에러코드="1")
    {
        /* ------------------------------- NULL CHECK ------------------------------- */
        if(!_fullpath.includes(".csv")) { console.error("fullpath 인자가 잘못되었습니다."); return false; }
        if(_모델이름.length == 0)        { console.error("모델이름 인자가 잘못되었습니다."); return false; }
        if(Number(_에러코드) < 1 || Number(_에러코드) > 14) { console.error("error_code 인자가 잘못되었습니다."); /*return false;*/ } 
        else _에러코드 = Number(_에러코드);
        if(isNaN(_에러코드)) { console.error("에러코드 인자가 잘못되었습니다."); return false; }
        // if(isNaN(_에러코드)) { _에러코드 = Math.round(Math.random()*14); }
        /* ------------------------------- NULL CHECK ------------------------------- */
        
        // >>> 240927 hjkim - 모델명이 포함된 파일이름 우선 사용하기
        // let _fullpath="/data/F002/BOP/2024/08/22/F002_20240822.csv";
        let _arr = _fullpath.split("/");
        _arr.pop();
        let _parent_path = _arr.join("/");
        fetch(_parent_path).then((res) => res.text())
        .then((html_txt) => {
            // >>> 241011 hjkim - 모델이름 find 조건 버그 수정
            if(html_txt.indexOf(_모델이름) > 0) { 
            // <<< 241011 hjkim - 모델이름 find 조건 버그 수정
                // CSV 목록중에 모델이름이 있을 경우,
                let _list = extract_uri_list(html_txt);
                _list.map(fname => {
                    if(fname.includes(_모델이름)){
                        let _modelname_in_fullpath = _parent_path+"/"+fname;
                        console.log("!@#$ _modelname_in_fullpath: ", _modelname_in_fullpath);
                        keep_going(_modelname_in_fullpath);
                    }
                });
            } else {
                // CSV 목록중에 모델이름이 없을 경우,
                keep_going(_fullpath);
            }
        });
        // <<< 240927 hjkim - 모델명이 포함된 파일이름 우선 사용하기

        function keep_going(_fullpath) {
            console.log("!@#$ fullpath, _모델이름, _에러코드 : ", _fullpath, _모델이름, _에러코드);
            const flot_el = () => document.querySelector("flot-in-ai");
            /* --------------------------- FULLPATH 404 CHECK --------------------------- */
            const controller = new AbortController();
            const signal = controller.signal;
            fetch(_fullpath+"?check", {signal: signal}).then(res => { /* 파일 있는지 간보기 */
                if(res.status != 200) { 
                    flot_el().innerHTML = `<img src="img/131517.png" alt="" style="width: 100%;">`; // 디자인 시안 출력
                    TABS.val = []; // 탭 초기화
                    // 에러 처리
                    console.error(`${_fullpath}의 RESPONSE CODE가 ${res.status} 입니다.`); 
                    controller.abort(); return false;
                } else { 
                    controller.abort(); 
                    create_or_update(_fullpath, _에러코드);
                }
            });
        }
        /* --------------------------- FULLPATH 404 CHECK --------------------------- */
        // const fullpath_aiparam = `/data/${STACK_NAME()}/BOP/MODEL/${_모델이름}/AIParam_v2.json`;
        function create_or_update(_fullpath, __errorcode) {
            if(flot_el() == null) {

                /* -------------------------------------------------------------------------- */
                /*                                Zoom In / Out                               */
                /* -------------------------------------------------------------------------- */
                // const {div, button, span} = van.tags;
                // const ZoomInOut = () => div({style:"display:inline-block"},
                //     button({class:"btn-of mid-size w50px", onclick:()=>zoom_in,  ontouchstart: ()=>zoom_in},
                //         span({class:"icon-zoom-in"})),
                //     button({class:"btn-of mid-size w50px", onclick:()=>zoom_out, ontouchstart: ()=>zoom_out},
                //         span({class:"icon-zoom-out"})),
                // )
                // console.log("!@#$ ZoomInOut : ", el.calendex, ZoomInOut());
                // van.add(document.querySelector(".widget.HW-senser-list .widget-head .widget-head-gadget"), ZoomInOut());
                
                if(window.sidecard_json == undefined) {
                    retry("window.sidecard_json != undefined", 500, 10, ()=> {
                        // 
                        const fields = Object.keys(window.sidecard_json.val[__errorcode]);
                        update_tab_ui(fields);
                        update_sidecard_ui(__errorcode, fields);
                        // 
                        let _min_idx = window.get_label_idx(window.sidecard_json.val.config.header, "min");
                        let _max_idx = window.get_label_idx(window.sidecard_json.val.config.header, "max");
                        let _min = window.sidecard_sel_arr.val[_min_idx];
                        let _max = window.sidecard_sel_arr.val[_max_idx];
                        el.graph.outerHTML = `<flot-in-ai fullpath=${_fullpath} fields=${fields} min="${_min}" max="${_max}">`;
                    });
                }
            } else {
                /* --------------------------------- UPDATE --------------------------------- */
                flot_el().setAttribute("fullpath", _fullpath);
                // /data/F002/BOP/2024/08/22/F002_20240822.csv
                // sidecard_el().innerHTML = `<sidecard-in-ai fullpath=${fullpath_aiparam} error-code=${_에러코드} event-name=${WIRING_002}>`;
                const fields = Object.keys(window.sidecard_json.val[__errorcode]);
                update_tab_ui(fields);
                update_sidecard_ui(__errorcode, fields);
                flot_el().setAttribute("fields", fields);
                console.log("!@#$ setAttribute fields : ", fields);
            }

            let temp = _fullpath.split("/");
            calendex_el().setAttribute( "date", [temp[4], temp[5], temp[6]].join("-") );
            // >>> 240928 hjkim - 
            setTimeout(() => calendex_el().setAttribute("filename", _fullpath), 1000);
            // <<< 240928 hjkim - 
        }

        function update_tab_ui(_fields) {
            /* ------------------------------- NULL CHECK ------------------------------- */

            /* ------------------------------- NULL CHECK ------------------------------- */
            console.log("!@#$ update_tab_ui / _fields : ", _fields);
            window.TABS.val = _fields;
            window.TAB_ON.val = _fields[0];
        }
        function update_sidecard_ui(__errorcode, __fields) {
            /* ------------------------------- NULL CHECK ------------------------------- */
            if(!is_array(__fields)) { console.error("__fields 인자가 배열이 아닙니다."); return false; }
            /* ------------------------------- NULL CHECK ------------------------------- */
            console.log("!@#$ update_sidecard_ui / __errorcode, __sel_field : ", __errorcode, __fields);
            window.sidecard_errorcode.val = __errorcode;
            window.sidecard_keys.val = __fields;
            window.sidecard_selected.val = __fields[0];
        }

        // function update_sidecard_ui(_fields, _error_code) {
        //     /* ------------------------------- EARLY EXIT ------------------------------- */
        //     if(_fields.length == 0) { console.error(`AI Params에서 에러코드(${_error_code}) 해당 값이 없습니다.`); return false; }
        //     /* ---------------------------- UPDATE SIDE CARD ---------------------------- */
        //     AI_PARAM_HIGH.val = json[_error_code][_fields[0]].high;
        //     AI_PARAM_LOW.val  = json[_error_code][_fields[0]].low;
        //     AI_PARAM_STD.val  = json[_error_code][_fields[0]].std;
        //     AI_PARAM_AVG.val  = json[_error_code][_fields[0]].avg;
        //     AI_PARAM_CON.val  = json[_error_code][_fields[0]].const;
        // }
    }

    function init_aitraining_graph_2(fullpath = "/data/F002/BOP/MODEL/F002_model/deltaP.csv", fields = [2, 3]) {
        /* ------------------------------- NULL CHECK ------------------------------- */
        if(!fullpath.includes(".csv")) { console.error("fullpath   인자가 잘못되었습니다."); return false; }
        if(!is_array(fields)) { console.error(`fields(${fields}) 인자가 잘못되었습니다.`); return false; }
        fields.map(field => {
            if(!is_number(field)) { console.error(`fields(${field}) 인자의 내용이 숫자가 아닙니다.`); return false; }
        });
        /* ------------------------------- NULL CHECK ------------------------------- */
        const flot_el2 = () => document.querySelector("flot-in-ai2");
        /* --------------------------- FULLPATH 404 CHECK --------------------------- */
        const controller = new AbortController();
        const signal = controller.signal;
        fetch(fullpath+"?check", {signal: signal}).then(res => {
            if(res.status != 200) { 
                console.error(`${fullpath}의 RESPONSE CODE가 ${res.status} 입니다.`); 
                // 그래프 요소 생성
                let _el = document.querySelector(".widget.soft-senser-graph .widget-body");
                // _el.innerHTML = `<div><img src="img/131805.png" alt="" style="width: 100%;"></div>`;
                _el.innerHTML = `<div><h3 style="color:#EBEBEB;">${res.url} (${res.status})</h3></div>`;
                controller.abort(); return false; // 파일 있는지 간보기
            } else {
                controller.abort(); // 파일 있는지 간보기
                // 그래프 요소 생성
                create_or_update()
            }
        });

        function create_or_update() {
            if(flot_el2() == null) {
                let _el = document.querySelector(".widget.soft-senser-graph .widget-body div");
                _el.outerHTML = `<flot-in-ai2 fullpath=${fullpath} fields="${fields}">`;
                console.log("!@#$ <flot-in-ai2> created");
            } else {
                flot_el2().setAttribute("fullpath", fullpath);
                flot_el2().setAttribute("fields", fields);
            }
        }
    }

    function init_calendex_1(fullpath = "/data/F002/BOP/2024/08/22/F002_20240822.csv", eventname = "AITRAINING/GRAPH1") {
        const pp= fullpath.split("/");
        const ymd = `${pp[4]}-${pp[5]}-${pp[6]}`;
        const csv = pp[7];
        const calendex_ph = document.querySelector(".widget.HW-senser-list .widget-head .widget-head-gadget");
        calendex_ph.innerHTML = `<calendex-in-ai date='${ymd}' filename='${csv}' event-name='${eventname}'>`;
    }

    /* ------------------------------- DOM WATCHER ------------------------------ */
    // const dom_watcher = new MutationObserver((mutationList, observer) => {
    //     let tbody_el = mutationList[mutationList.length-1].target;
    //     console.log("!@#$ tbody_el : ", tbody_el); 
    //     // TODO: clickHandler
    //     let el_arr = Array.from(tbody_el.querySelectorAll(".date-div"));
    //     let errcode_arr = Array.from(tbody_el.querySelectorAll("td:nth-child(5)")).map(el => el.innerText);
        
    //     init_date_click_handler(el_arr, errcode_arr);
    // });
    // const shared_tbl = document.querySelector("#fault-label-list-table");
    // dom_watcher.observe( shared_tbl, { childList: true, subtree: true, attributeOldValue: true, characterData: false } );

    // function init_date_click_handler(els, errs) {
    //     els.map((el, i) => {
    //         el.style.cursor = "pointer";
    //         el.addEventListener("click", ({target}) => {
    //             // /data/F002/BOP/2024/09/05/F002_20240905.csv
    //             let date = target.innerText;
    //             let err = errs[i];
    //             let pp = date.split("-");
    //             let yyyy = pp[0], mm = pp[1], dd = pp[2];
    //             let fullpath = `/data/${STACK_NAME()}/BOP/${yyyy}/${mm}/${dd}/${STACK_NAME()}_${yyyy}${mm}${dd}.csv`;
    //             console.log("!@#$ fullpath, date, err : ", fullpath, date, err);
    //             init_aitraining_graph_1v2(fullpath, err);
    //         });
    //     });
    // }
    /* ------------------------------- DOM WATCHER ------------------------------ */
}


/* -------------------------------------------------------------------------- */
/*                              UTIL FUNCTION SET                             */
/* -------------------------------------------------------------------------- */
function is_number(value) { 
    if(isNaN(value)) return false; 
    else return typeof value === 'number'; }
function is_bool(value)   { return typeof value === 'boolean'; }
function is_string(value) { return typeof value === 'string'; }
function is_object(value) { return typeof value === 'object'; }
function is_array(value)  { return Array.isArray(value); }

// >>> 241007 hjkim - 
if(is_title("BOP진단")) {
    // reset_calendex(2024, 9, 1);
    // 외부에서 호출하는 함수 reset_calendex
    function reset_calendex(y=2024, m=10, d=17) {
        // setTimeout(() => { _set_opt("#yearly",   y, true); }, 1);
        // setTimeout(() => { _set_opt("#monthly",  m, true); }, 10);
        // setTimeout(() => { _set_opt("#daily",    d, true); }, 100);
        _set_opt("#yearly", y, true);
        retry("g_el.yearly.disabled == false", 300, 10, () => { _set_opt("#monthly", m, true); });
        retry("g_el.monthly.disabled == false", 300, 10, () => { _set_opt("#daily", d, true); });
    }
    // 내부에서만 사용하는 함수 _set_opt
    function _set_opt(id_str, sel_str, is_trigger = false) {
        let sel = document.querySelector(id_str);
        const arr = Array.from(sel.options);
        arr.map((label, idx) => {
            (label.value.includes(zero_pad(sel_str))) ? sel.selectedIndex = idx : "";
        });
        // 선택박스 변경후, change 이벤트를 트리거 
        // -> g_el.yearly, g_el.monthly, g_el.daily, g_el.timely의 change 이벤트 핸들러 호출
        if(is_trigger) sel.dispatchEvent(new Event('change'));
    }
}
// <<< 241007 hjkim - 

/* -------------------------------------------------------------------------- */
/*                                    CONST                                   */
/* -------------------------------------------------------------------------- */
var opts = () => { 
    return {
        title: "Voltage Change Detection",
        id: "chart1",
        class: "my-chart",
        width: (get_placeholder_width)(),
        height: 600,
        series: [
            { label: "Time"},
            { label: "Voltage", stroke: "#0000FF", scale: "V", width: 1, 
                points : { space: 0, /*fill: "#0000FF"*/ show : false},/*paths: u=> null,*/
                value: (self, rawValue) => Number.isFinite(rawValue) ? rawValue.toFixed(4) + "V" : "" },
            { label: "Current", stroke: "#008000", scale: "A", width: 1,
                points : { space: 0, fill: "#008000", show : false }, //paths: u=> null,
                value: (self, rawValue) => Number.isFinite(rawValue) ? rawValue.toFixed(4) + "A" : "" },
            { label: "Voltage(MA)", stroke: "#FFA500", scale: "V", width: 3, 
                points : {show : false},
                value: (self, rawValue) => Number.isFinite(rawValue) ? rawValue.toFixed(4) + "V" : ""},
            { label: "Current(MA)", stroke: "#C1E715", scale: "A", width: 3, 
                points : {show : false},
                value: (self, rawValue) => Number.isFinite(rawValue) ? rawValue.toFixed(4) + "A" : ""},
        ],
        axes: [
            {},
            { scale: "V", values: (self, ticks) => ticks.map(rawValue => rawValue.toFixed(4) + " V"), size: 70, },
            { scale: "A", values: (self, ticks) => ticks.map(rawValue => rawValue.toFixed(4) + " A"), side: 1, size: 70, grid: {show: false}, },
            // { scale: "V2", values: (self, ticks) => ticks.map(rawValue => rawValue.toFixed(1) + "V(MA)"), },
            // { scale: "A2", values: (self, ticks) => ticks.map(rawValue => rawValue.toFixed(2) + "A(MA)"), side: 1, grid: {show: false}, },
        ],
        scales: { 
            "x": { time: false, distr: 2, },
            //"V": { range: [0.200, 0.204], },
            "V": { range: (u, min, max) => [Math.min(min, max), Math.max(min, max)] },
            "A": { range: (u, min, max) => [Math.min(min, max), Math.max(min, max)] }
        },
        hooks: {
            drawSeries: [
                (u, si) => {
                    let ctx = u.ctx;
                    ctx.save();
                    let s  = u.series[si];
                    let xd = u.data[0];
                    let yd = u.data[si];
                    // console.log(s, xd, yd);
                    let [i0, i1] = s.idxs;
                    // console.log(i0, i1);
                    let x0 = u.valToPos(xd[i0], 'x', true);
                    let y0 = u.valToPos(yd[i0], 'y', true);
                    let x1 = u.valToPos(xd[i1], 'x', true);
                    let y1 = u.valToPos(yd[i1], 'y', true);
                    console.log(xd[i0], yd[i0], xd[i1], yd[i1]);
                    if(isFinite(y0) == false) y0 = 65535;
                    if(isFinite(y1) == false) y1 = 65535;
                    const offset = (s.width % 2) / 2;
                    // console.log(offset);
                    ctx.translate(offset, offset);
                    ctx.beginPath();
                    ctx.strokeStyle = s._stroke;
                    ctx.setLineDash([5, 5]);
                    ctx.moveTo(x0, y0);
                    ctx.lineTo(x1, y1);
                    ctx.stroke();
                    ctx.translate(-offset, -offset);
                    ctx.restore();
                }
            ]
        }
    };
};

/* -------------------------------------------------------------------------- */
/*                                FUNCTION SET                                */
/* -------------------------------------------------------------------------- */
function parse_pulse_handler(json) {
    const raw = json.raw;
    const ma = json.ma;
    const meta = json.meta;

    const time = raw.time.map(t => t * 1e-6);
    const voltage = raw.voltage;
    const current = raw.current;
    const ma_voltage = ma.voltage;
    const ma_current = ma.current;

    const extractPoint = p => p ? [p[0] * 1e-6] : []; // x 좌표
    const extractValue = p => p ? [p[1]] : [];        // y 좌표

    const meta_ma_ps_x = extractPoint(meta.MA.PS);
    const meta_ma_ps_y = extractValue(meta.MA.PS);
    const meta_ma_pm_x = extractPoint(meta.MA.PM);
    const meta_ma_pm_y = extractValue(meta.MA.PM);
    const meta_ma_pe_x = extractPoint(meta.MA.PE);
    const meta_ma_pe_y = extractValue(meta.MA.PE);
    const meta_ma_p1_x = extractPoint(meta.MA.P1);
    const meta_ma_p1_y = extractValue(meta.MA.P1);
    const meta_ma_p3_x = extractPoint(meta.MA.P3);
    const meta_ma_p3_y = extractValue(meta.MA.P3);
    const meta_ma_p4_x = extractPoint(meta.MA.P4);
    const meta_ma_p4_y = extractValue(meta.MA.P4);

    const meta_gs_p3_x = extractPoint(meta.GS.P3);
    const meta_gs_p3_y = extractValue(meta.GS.P3);
    const meta_gs_pm_x = extractPoint(meta.GS.PM);
    const meta_gs_pm_y = extractValue(meta.GS.PM);
    const meta_gs_pq_x = extractPoint(meta.GS.PQ);
    const meta_gs_pq_y = extractValue(meta.GS.PQ);

    return {
        data: [
            time,
            voltage,
            current,
            ma_voltage,
            ma_current
        ],
        metaPoints: {
            MA: {
                P1: [meta_ma_p1_x, meta_ma_p1_y],
                P3: [meta_ma_p3_x, meta_ma_p3_y],
                P4: [meta_ma_p4_x, meta_ma_p4_y],
                PS: [meta_ma_ps_x, meta_ma_ps_y],
                PE: [meta_ma_pe_x, meta_ma_pe_y],
                PM: [meta_ma_pm_x, meta_ma_pm_y],
            },
            GS: {
                P3: [meta_gs_p3_x, meta_gs_p3_y],
                PM: [meta_gs_pm_x, meta_gs_pm_y],
                PQ: [meta_gs_pq_x, meta_gs_pq_y],
            }
        }
    };
}


function get_placeholder_width() {
    // console.log("!@#$ width : ", document.querySelector("pulse-graph-in-stack").offsetWidth);
    // return document.querySelector("pulse-graph-in-stack").offsetWidth | 1250;
    return document.querySelector(".widget.stack-state-graph .widget-body.d-grid").offsetWidth - 50;
}

function optsOverlay(numSets) {
    const series = [{ label: "Time" }];
    for (let i = 0; i < numSets; i++) {
        series.push({ label: `Voltage ${i+1}`,
                      stroke: "#0000FF", 
                      scale: "V",
                      width: 1,
                      points: { show: false },
                      value: (u, val) => val != null ? val.toFixed(4) + " V" : null });
        series.push({ label: `Current ${i+1}`, 
                      stroke: "#008000", 
                      scale: "A", 
                      width: 1, 
                      points: { show: false },
                      value: (u, val) => val != null ? val.toFixed(4) + " A" : null });
        series.push({ label: `Voltage(MA) ${i+1}`,
                      stroke: "#FFA500",
                      scale: "V",
                      width: 3, 
                      points: { show: false },
                      value: (u, val) => val != null ? val.toFixed(4) + " V" : null });
        series.push({ label: `Current(MA) ${i+1}`,
                      stroke: "#C1E715", 
                      scale: "A", 
                      width: 3, 
                      points: { show: false },
                      value: (u, val) => val != null ? val.toFixed(4) + " A" : null });
    }
    return {
        title: "Voltage Change Detection",
        width: get_placeholder_width(),
        height: 600,
        series: series,
        axes: [
            {},
            { scale: "V", values: (self, ticks) => ticks.map(rawValue => rawValue.toFixed(4) + " V"), size: 70 },
            { scale: "A", values: (self, ticks) => ticks.map(rawValue => rawValue.toFixed(4) + " A"), side: 1, size: 70, grid: { show: false } }
        ],
        scales: {
            x: { time: false, distr: 1 },
            V: { range: (u, min, max) => [Math.min(min, max), Math.max(min, max)] },
            A: { range: (u, min, max) => [Math.min(min, max), Math.max(min, max)] }
        },
        legend: {
            show: true,
            live: true,
        },
    };
}

// function init_pulse_graph(_fullpath = "") {
//     const graphElement = document.querySelector("pulse-graph-in-stack");
//     if (graphElement) {
//       graphElement.setAttribute("fullpath", _fullpath);
//       graphElement.drawMultipleGraphs([_fullpath]); 
//     }
//   }
  

const selectedFullpaths = new Set();
function onCheckboxChange(checkbox, fullpath) {
  if (checkbox.checked) {
    selectedFullpaths.add(fullpath);
  } else {
    selectedFullpaths.delete(fullpath);
  }
}


/* -------------------------------------------------------------------------- */
/*                          CLASS FOR CUSTOM ELEMENT                          */
/* -------------------------------------------------------------------------- */
/* <pulse-graph-in-stack fullpath="/d2024-10-29-16-14-21/"></pulse-graph-in-stack> */
class PulseGraphInStack extends HTMLElement {
    constructor() {
        super();
        this.SUMMARY_FILENAME = "summary.json";  
        this.fullpaths = [];
        this.loading = false;  
        this.totalFiles = 0;   
        this.loadedFiles = 0;  
    }
    
    setViewMode(mode) {
        this.viewMode = mode;
    }

    static get observedAttributes() {
        return ["fullpath"];
    }

    // fullpath 값이 바뀔 때마다 새로운 그래프 렌더링
    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal !== undefined && name === "fullpath") {
            console.log(`Attribute ${name} has changed:`, oldVal, "→", newVal);
            this.destroyPlot();
            // 쉼표로 분리된 문자열을 배열로 변환
            const paths = newVal.split(",").map(s => s.trim()).filter(s => s.length > 0);
            this.fullpaths = paths;
            this.init_DOM();
            this.init_data();
        }
    }

    // 커스텀 엘리먼트가 DOM에 붙을 때 호출됨
    connectedCallback() {
        console.log("connectedCallback @ PulseGraphInStack");
        const fullpathAttr = this.getAttribute("fullpath");
        if (fullpathAttr) {
            const paths = fullpathAttr.split(",").map(s => s.trim()).filter(s => s.length > 0);
            this.fullpaths = paths;
        }
        this.init_DOM();
        this.init_data();
    }
    
    // 기존 그래프 객체 제거 (중복 생성 방지)
    destroyPlot() {
        if (this.uplot) {
            this.uplot.destroy();
            delete this.uplot;
        }
    }

    // 그래프를 그릴 DOM 구조 생성
    init_DOM() {
        const { div } = van.tags;
        const PulseGraph = () => div({ id: "pulse-graph", width: "100%" });
        this.innerHTML = ""; 

        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loading-indicator';
        loadingIndicator.style.display = 'none';
        loadingIndicator.innerHTML = `
            <progress max="100" value="0"></progress>
            <div>그래프 불러오는 중...</div>
        `;
        this.appendChild(loadingIndicator);  
        this.custom_element = PulseGraph();
        van.add(this, this.custom_element);
        console.log("opts().width:", opts().width);
        if (this.viewMode === 'overlay') {
            this.uplot = new uPlot(optsOverlay(this.fullpaths.length), [], this.custom_element);
            setTimeout(() => {
                const legend = this.custom_element.querySelector(".u-legend");
                if (legend) {
                    legend.style.maxHeight = "50px";  
                    legend.style.overflowY = "auto";
                }
            }, 0);
        } else {
            this.uplot = new uPlot(opts(this.fullpaths.length), [], this.custom_element);
        }
        window.uplot = this.uplot;  
    }

    async init_data() {
        this.setLoading(true);  
        if (!this.fullpaths || this.fullpaths.length === 0) return;
        this.totalFiles = this.fullpaths.length;  
        this.loadedFiles = 0;
        if(this.viewMode === 'single'){
            try {
                const res = await fetch(`/data/${this.fullpaths[0]}`);
                if (!res.ok) throw new Error(`Fetch failed: ${this.fullpaths[0]}`);
                const json = await res.json();
                const parsed = parse_pulse_handler(json);
        
                this.uplot.setData(parsed.data);
            } catch (e) {
                console.error(`Failed to load or parse ${this.fullpaths[0]}`, e);
            } finally {
                this.loadedFiles++;
                this.updateProgress();
            }
        } else if (this.viewMode === 'timeseries') {
            const allData = [];
            let offset = 0;
            for (const path of this.fullpaths) {
                try {
                    const res = await fetch(`/data/${path}`);
                    if (!res.ok) throw new Error(`Fetch failed: ${path}`);
                    const json = await res.json();
                    const parsed = parse_pulse_handler(json);
                    allData.push(parsed.data);
                } catch (e) {
                    console.error(`Failed to load or parse ${path}`, e);
                } finally {
                    this.loadedFiles++;
                    this.updateProgress();  
                }
            }
            const merged = this.mergeTimeSeriesData(allData, offset);
            this.uplot.setData(merged);
        } else if (this.viewMode === 'overlay') {
            const allData = [];
            for (const path of this.fullpaths) {
                try{
                    const res = await fetch(`/data/${path}`);
                    if (!res.ok) throw new Error(`Fetch failed: ${path}`);
                    const json = await res.json();
                    const parsed = parse_pulse_handler(json);
                    allData.push(parsed.data);
                } catch (e) {
                    console.error(`Failed to load or parse ${path}`, e);
                } finally {
                    this.loadedFiles++;
                    this.updateProgress();
                }
            }
            const merged = this.mergeOverlayData(allData);
            this.uplot.setData(merged);
        } 
        this.setLoading(false);  
    }

    setFullpaths(paths) {
        this.fullpaths = paths;
        this.destroyPlot();
        this.init_DOM();
        this.init_data();
    }

    // 로딩 바 상태 업데이트
    updateProgress() {
        const progress = this.querySelector('#loading-indicator progress');
        if (progress) {
            const percent = (this.loadedFiles / this.totalFiles) * 100;
            progress.value = percent;
        }
    }
    
    mergeTimeSeriesData(dataList, offset) {
        const merged = [[], [], [], [], []]; 
        for (const data of dataList.reverse()) { // 최신데이터가 가장 오른쪽으로
            const shiftData = data[0].map(value => value + offset);  
            for (let i = 0; i < data[0].length; i++) {
                merged[0].push(shiftData[i]);
                merged[1].push(data[1][i]);
                merged[2].push(data[2][i]);
                merged[3].push(data[3][i]);
                merged[4].push(data[4][i]);
            }
            offset = merged[0][merged[0].length - 1];  
        }
        const zipped = merged[0].map((t, i) => [t, merged[1][i], merged[2][i], merged[3][i], merged[4][i]]);
        zipped.sort((a, b) => a[0] - b[0]);
        return [
            zipped.map(x => x[0]),
            zipped.map(x => x[1]),
            zipped.map(x => x[2]),
            zipped.map(x => x[3]),
            zipped.map(x => x[4])
        ];
    }

    mergeOverlayData(dataList) {
        if (dataList.length === 0) return [];
    
        const baseX = Array.from(new Set(dataList.flatMap(d => d[0]))).sort((a, b) => a - b);
        const merged = [baseX];
    
        for (const data of dataList) {
            for (let si = 1; si <= 4; si++) {  
                const map = new Map();
                for (let i = 0; i < data[0].length; i++) {
                    map.set(data[0][i], data[si][i]);
                }
                const alignedY = baseX.map(x => map.has(x) ? map.get(x) : null);
                merged.push(alignedY);
            }
        }
        return merged;
    }

    setLoading(isLoading) {
        this.loading = isLoading;
        const indicator = this.querySelector('#loading-indicator');
        if (indicator) {
            indicator.style.display = isLoading ? 'block' : 'none';
        }
    }

    clearGraph() {
        this.destroyPlot();        // 그래프 객체 제거
        this.innerHTML = '';       // 내부 DOM 초기화
        this.fullpaths = [];       // 데이터 경로 초기화
        this.loadedFiles = 0;
        this.totalFiles = 0;
    }
}

document.getElementById('clearBtn').addEventListener('click', () => {
    sessionStorage.removeItem('selectedFullpaths');
    const pulseGraphEl = document.querySelector('pulse-graph-in-stack');
    if (pulseGraphEl && typeof pulseGraphEl.clearGraph === 'function') {
        pulseGraphEl.clearGraph();
    }
    document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]:checked')
        .forEach(cb => cb.checked = false);
    updateSelectedCount();
});


// >>> 241128 hjkim - Bode 그래프 추가
class BodeGraphInStack extends HTMLElement {
    constructor() {
        super();
    }

    disconnectedCallback() {}

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, old_val, new_val) {
        if(old_val != undefined) { // Updated
            console.log(`!@#$ [BodeGraphInStack] / Attribute ${name} has changed : `, name, old_val, new_val);
            switch(name) {
                case "fullpath":
                break;
            }
        }
    }

    connectedCallback() {
        console.log("connectedCallback @ BodeGraphInStack");
        this.fullpath = this.getAttribute("fullpath");
        this.init_DOM();
    }

    init_DOM() {
        const {div} = van.tags;
        const BodeGraph = () => div({id: "bode-graph", width: "100%"});
        this.custom_element = BodeGraph();
        van.add(this, this.custom_element);
        //
        Run_BodeChart( (this.bode_chart || (this.bode_chart = {})) );
        this.bode_chart.IImpedanceChart_init(this.custom_element, 100, 100);
    }
}
// <<< 241128 hjkim - Bode 그래프 추가

/* -------------------------------------------------------------------------- */
/*                                MAIN SEQUENCE                               */
/* -------------------------------------------------------------------------- */
if(is_title("스택진단")) {
    window.addEventListener("load", function() {
        customElements.define("pulse-graph-in-stack", PulseGraphInStack);
        // INIT PULSE GRAPH
        let placeholder = document.querySelector(".widget.stack-state-graph .widget-body.d-grid .content-section:nth-child(2)");
        placeholder.innerHTML = `<pulse-graph-in-stack fullpath="F002/EIS/2024/10/pulse_data/d2024-10-29-16-14-21/" width="1250px"></pulse-graph-in-stack>`;
        // placeholder.innerHTML = `<pulse-graph-in-stack fullpath="F002/EIS/2024/10/pulse_data/d2024-10-29-15-55-38/" width="1250px"></pulse-graph-in-stack>`;
        
        // >>> 241128 hjkim - Bode 그래프 추가
        customElements.define("bode-graph-in-stack", BodeGraphInStack);
        // placeholder.innerHTML = `<bode-graph-in-stack></bode-graph-in-stack>`;
        // <<< 241128 hjkim - Bode 그래프 추가
        
        /* -------------------------------- TEMP CODE ------------------------------- */
        let sel_el = document.querySelector(".stack-state-graph .select-title");
        sel_el.value = '1';
        var event = new Event('change');
        sel_el.dispatchEvent(event);
        /* -------------------------------- TEMP CODE ------------------------------- */
    });
}

