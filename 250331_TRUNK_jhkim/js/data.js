//      
                                                                                         
                                                   
                                      
                      
                            
                        
                      
                                     
                         
                   
                            
                            
                            
                           
                               
                                   
                                  
                                   
                                   
                                   
                                    
                                  
                                   
                                  
                                   
                        
                                
                               
                                
                                
                               
                                 
                                 
                                 
                                
                                
                       
                                
                               
                                
                   
                       
                            
                            
                            
  
                   
                   
                  
                
                   
  

/* -------------------------------------------------------------------------- */
/*                                TYPE CHECKER                                */
/* -------------------------------------------------------------------------- */
function is_number(value) { 
    if(isNaN(value)) return false; 
    else return typeof value === 'number'; }
function is_bool(value)   { return typeof value === 'boolean'; }
function is_string(value) { return typeof value === 'string'; }
function is_object(value) { return typeof value === 'object'; }
function is_array(value)  { return Array.isArray(value); }

// >>> 240828 hjkim - CH1/(5)RAW_DATA_FETCH
const VALID_COLNAME = { 
    "Date": true,
    "Time": true,
    "T_A_B_in(116)": true,
    "T_A_m_out(110)": true,
    "T_A_S_in(113)": true,
    "T_A_S_out(109)": true,
    "T_A_vent(115)": true,
    "T_F_S_in(112)": true,
    "T_F_S_out(111)": true,
    "T_DI_h_out(107)": true,
    "T_DI_S_in(114)": true,
    "T_DI_S_out(108)": true,
    "T_w_h_out(103)": true,
    "T_w_t_in(101)": true,
    "T_w_t_out(102)": true,
    "blank1": true,
    "blank2": true,
    "P_A_B_in(105)": true,
    "P_A_m_out(102)": true,
    "P_A_S_in(101)": true,
    "P_A_S_out(104)": true,
    "P_F_S_in(103)": true,
    "P_DI_p_in(4)": true,
    "P_DI_p_out(5)": true,
    "P_w_h_out(6)": true,
    "P_w_p_in(1)": true,
    "P_w_p_out(2)": true,
    "MFC1(H2)": true,
    "MFC2(N2)": true,
    "MFM3(Air)": true,
    "MFM2(DI)": true,
    "MFM1(Water)": true,
    "Air(%)": true,
    "DI(%)": true,
    "Water(%)": true,
    "DI_Conductivity": true,
    "Current": true,
    "Voltage": true,
    "T_w_h_in(104)": true,
    "Result": true,
    "deltaP": true,
    "UA": true,
    "Ms": true,
    "Mr": true,
    "R_Water_R1": true,
    "R_Water_R2": true,
    "R_Water_R3": true,
    "R_Air_deltaP": true,
    "R_Air_U": true,
    "R_Air_P1": true,
    "R_Air_V": true,
    "R_heat": true,
    "R_Ms": true,
    "R_Mr": true,
    "R_DI": true,
    "R_WP": true,
    // deltaP.csv
    "y": true,
    "y_pred": true,
    "R_avg": true,
    "R_std": true,
    "R": true,
    "_R": true,
};
// <<< 240828 hjkim - CH1/(5)RAW_DATA_FETCH

/* -------------------------------------------------------------------------- */
/*                                 WEB WORKER                                 */
/* -------------------------------------------------------------------------- */
// AbortController
const controller = new AbortController();
const controller2 = new AbortController();
const signal = controller.signal;
const signal2 = controller2.signal;
var abort_once1 = true;
var abort_once2 = true;
const ASYNC_WAIT_TIMEOUT = 50;

// 웹 워커 코드
self.onmessage = function(argv) {
    // console.log("data.js / argv.ports : ", argv.ports);
    const port1 = argv.ports[0];
    // console.log("data.js / worker msg : ", argv.data.msg);
    switch(argv.data.msg) {
        case "INIT_CHANNEL1":
            port1.onmessage = (e) => { channel1_handler(e, port1); }
        break;
        case "INIT_CHANNEL2":
            port1.onmessage = (e) => { channel2_handler(e, port1); }
        break;
        case "INIT_CHANNEL3":
            port1.onmessage = (e) => { channel3_handler(e, port1); }
        break;
    }
    // console.log("data.js / port : ", port1);
}

function channel1_handler(argv, port1) {
    // console.log("data.js / channel1_handler / argv : ", argv);
    var path_obj, base_url, call_once, downloaded_url;
    switch(argv.data.msg) {

        case "CH1/(1)DASHBOARD_INIT":
            base_url = argv.data.url;
            call_once = true;
            downloaded_url = [];
            path_obj = { history:[], map:{}, map_full:{} };
            // 백트래킹 시작
            dfs_with_backtracking(base_url, path_obj, 0, (url, path) => {
                downloaded_url.push(url);
                // 비동기 요청 정렬
                if(call_once) { call_once = false;
                    setTimeout(() => {
                        var sorted_url = downloaded_url.sort().reverse();
                        // 가져온 데이터를 메인 스레드로 전송
                        port1.postMessage({msg: "CH1/(a)DASHBOARD_DATA", url : sorted_url[0], history: path});
                    }, ASYNC_WAIT_TIMEOUT);
                }
            });
        break;

        case "CH1/(2)GET_DIR":
            const response = argv.data.response;
            var url = argv.data.url;
            url = url.replaceAll("//", "/");
            fetch(url)
            .then(res => res.text())
            .then(txt => _extract_url(txt))
            .then(include => {
                // console.log("data.js / url :", url);
                // >>> 240826 hjkim - 경로변경
                // if(url == "/ALL/data" || url == "/ALL/data/") 
                const re = /\/data\/.*\/BOP\/$/;
                if(url.match(re) != null)  // 년단위 폴더
                // <<< 240826 hjkim - 경로변경
                    return include.filter((d       ) => /^[0-9]{4}\//.exec(d) );
                else 
                    return include.filter((d       ) => (d.includes(".csv") && !d.includes(".gz") && !d.includes(".bak")) || /[0-9]+.*\//.exec(d));
            })
            .then(list => { port1.postMessage({msg: response, list: list}); });
        break;

        case "CH1/(3)BOP_INIT":
            base_url = argv.data.url; // ex) /data/SE01/F002/BOP/
            call_once = true;
            downloaded_url = [];
            path_obj = {history:[], map:{}, map_full:{}};
            
            // >>> 241128 hjkim - recent.conf 파일 참조 후, 단순 ymd 탐색
            fetch(base_url+"recent.conf")
            .then(res => { 
                if(res.status != 200) { throw new Error(`${res.url} 수신에 오류가 있습니다.`); }
                return res;
            })
            .then(res => res.text())
            .then(txt => { // ex) 20241128
                if(txt.length < 8) { new Error(`${res.url} 내용에 오류가 있습니다.`); }
                let ymd = [txt.slice(0, 4), txt.slice(4, 6), txt.slice(6, 8)];
                let key = [
                    `${base_url}`, 
                    `${base_url}${ymd[0]}`, 
                    `${base_url}${ymd[0]}/${ymd[1]}`, 
                    `${base_url}${ymd[0]}/${ymd[1]}/${ymd[2]}`
                ];
                let fetch_y = fetch(key[0]).then(res => res.text());
                let fetch_m = fetch(key[1]).then(res => res.text());
                let fetch_d = fetch(key[2]).then(res => res.text());
                let fetch_f = fetch(key[3]).then(res => res.text());
                Promise.all([fetch_y, fetch_m, fetch_d, fetch_f])
                .then(data => { 
                    let y_list = _extract_url(data[0]).filter(_d => /^[0-9]{4}\/$/.exec(_d) );
                    let m_list = _extract_url(data[1]).filter(_d => /^[0-9]{2}\/$/.exec(_d) );
                    let d_list = _extract_url(data[2]).filter(_d => /^[0-9]{2}\/$/.exec(_d) );
                    let f_list = _extract_url(data[3]).filter(_d => /.*\.csv$/.exec(_d) );
                    let _url = `${key[3]}/${f_list[f_list.length-1]}`;
                    let _history = { 
                        history: [key[0], key[1], key[2], key[3], _url],
                        map: {}, 
                        map_full: {}
                    }
                    _history.map[`${key[0]}` ] = y_list;
                    _history.map[`${key[1]}/`] = m_list;
                    _history.map[`${key[2]}/`] = d_list;
                    _history.map[`${key[3]}/`] = f_list;
                    port1.postMessage({ msg: "CH1/(f)BOP_DATA", url: _url, history: _history });
                });
            });
            // <<< 241128 hjkim - recent.conf 파일 참조 후, 단순 ymd 탐색
            
            // 백트래킹 시작
            // dfs_with_backtracking___bop(base_url, path_obj, 0, (url, path) => {
            //     downloaded_url.push(url);
            //     // 비동기 요청 정렬
            //     if(call_once) { call_once = false;
            //         setTimeout(() => {
            //             var sorted_url = downloaded_url.sort().reverse();
            //             // 가져온 데이터를 메인 스레드로 전송
            //             port1.postMessage({msg: "CH1/(f)BOP_DATA", url : sorted_url[0], history: path});
            //         }, 1000);
            //     }
            // });
        break;
        case "CH1/(4)BOP_DATA_FETCH":
            // NULL CHECK
            var IS_INVALID = false;
            if(is_string(argv.data["url"]) == false) { 
                console.error(`${argv.data.msg} 에서 url(${argv.data['url']}) 인자가 String 이 아닙니다.`);
                IS_INVALID|= true;
            }
            if(is_string(argv.data["imp_url"]) == false) { 
                console.error(`${argv.data.msg} 에서 imp_url(${argv.data['imp_url']}) 인자가 String 이 아닙니다.`);
                IS_INVALID|= true;
            }
            if(is_number(argv.data["window_size"]) == false) { 
                console.error(argv.data.msg + `에서 window_size(${argv.data['window_size']}) 인자가 Number 가 아닙니다. @ ${argv.data['debug']}`); 
                IS_INVALID|= true;
            }
            if(is_bool(argv.data["is_result"]) == false) {
                console.warn(argv.data.msg + `에서 is_result(${argv.data['is_result']}) 인자가 Boolean 이 아닙니다. @ ${argv.data['debug']}`); 
            }
            if(IS_INVALID) return;

            // FETCH PROCESS
            fetch(argv.data.url)
            .then( d => d.text())
			// .then( debug => { console.log(debug); return debug; })
            // 1.CSV를 mapped JSON으로 파싱
            .then( (txt       ) => fn_parse_csv_into_mapped_json(txt))
            // >>> 240724 hjkim - 데이터 테이블로 전송
            .then( (json ) => { 
                port1.postMessage({msg: "CH2/(b)SENSOR_TABLE", tabledata: json });
                return json;
            })
            // <<< 240724 hjkim - 데이터 테이블로 전송
            // 2.mapped JSON을 flot_data로 전처리
			//.then( (json) => { console.log("#", json); return json; } )
			//.then( (json) => json.filter(r => r.Time.indexOf("11-") != 0))
            .then( (json                ) => fn_json_to_flotdata_with_timestamp(json)) 
            .then( (flotdata             ) => {
                // console.log("data.js / flotdata : ", flotdata);
                // 3. flot_data를 필터링 (R_ == 소프트 센서 데이터)
                //var soft_flotdata = flotdata.filter( (d) => d.label.includes("R_") );
				var soft_flotdata = flotdata.filter( (d) => {
                    // >>> 241204 hjkim - Soft센서 그래프에서 Ratio 데이터 삭제
					// return d.label.includes("R_") || d.label.includes("Ratio") ;
					return d.label.includes("R_");
                    // <<< 241204 hjkim - Soft센서 그래프에서 Ratio 데이터 삭제
				});
				console.log("!@#$ /soft_flotdata: ", soft_flotdata);
                port1.postMessage({msg: "CH1/(g)BOP_SOFT_FLOTDATA", flotdata: soft_flotdata});
                // 4. flot_data를 필터링 (하드 센서 데이터)
				//console.log("# flotdata : ", flotdata);
                var hard_flotdata = flotdata.filter( (d) => {
                    // >>> 240827 hjkim - Result 값 토글 
                    if(argv.data["is_result"] == true) {
                        return (!d.label.includes("R_") 
                        && !d.label.includes("deltaP")
                        && !d.label.includes("UA")
                        && !d.label.includes("Ms")
                        && !d.label.includes("Mr"));
                    } else {
                        return (!d.label.includes("R_") 
                        && !d.label.includes("deltaP")
                        && !d.label.includes("UA")
                        && !d.label.includes("Ms")
                        && !d.label.includes("Mr")
                        && !d.label.includes("Result"));
                    }
                    // <<< 240827 hjkim - Result 값 토글 
                });
                // >>> 240722 hjkim - 시작/끝 시간 계산 버그 수정
                const findMin = (arr) => {
                    return arr.reduce((min, curr) => {
                        return curr[0] < min ? curr[0] : min;
                    }, arr[0][0]);
                };
                const findMax = (arr) => {
                    return arr.reduce((max, curr) => {
                        return curr[0] > max ? curr[0] : max;
                    }, arr[0][0]);
                };
                const stime = findMin(flotdata[0].data);
                const etime = findMax(flotdata[0].data);
                // <<< 240722 hjkim - 시작/끝 시간 계산 버그 수정
                port1.postMessage({msg: "CH1/(h)BOP_HARD_FLOTDATA", flotdata: hard_flotdata, stime: stime, etime: etime });
                // 5. flot_dtat를 필터링 (BOP 바차트 데이터)
                const x = 0;
                // console.log("data.js / flotdata : ", flotdata);
                const len =   flotdata[0].data.length;
                var time_flag = {};
				// >>> 240521 hjkim - 말풍선 UI 수정
                //const WINDOW_SIZE = 30*60*1000;
				const JUMP_30MIN = 180; /* 30분 점프 (1칸당 10초) */
				const JUMP_10MIN = 60;  /* 10분 점프 (1칸당 10초) */
				// <<< 240521 hjkim - 말풍선 UI 수정

                var bop_bardata = flotdata.filter( (d) => d.label.includes("Result") )
                .map(d => {
                    if(argv.data.window_size != -1) { // 윈도우 사용-----------
                        // >>> 240720 hjkim - 윈도우내 최빈값 사용
                        // >>> WINDOW INIT
                        let wsize = argv.data.window_size;
                        var window = new Array(wsize);
                        for(let k = 0; k < window.length; k++) { window[k] = d.data[k][1]; }
                        // <<< WINDOW INIT
                        for(let i = 0; i < d.data.length; i++) {
                            // >>> 전처리부
                            if(i != 0 && i < (d.data.length-10)) {
                                window.shift();
                                let v = d.data[i+10][1];
								// >>> 241126 hjkim - 백엔드로 부터 이상수치가 더이상 안 들어옴
                                //if(v >= 15) v = 0; // 정상 = 0, 15, 16
								// <<< 241126 hjkim - 백엔드로 부터 이상수치가 더이상 안 들어옴
                                window.push(v);
                            }
                            // <<< 전처리부
                            let freq_table = {};
                            for(let k = 0; k < window.length; k++) {
                                if(freq_table[window[k]] == undefined) { freq_table[window[k]] = 1; }
                                else { freq_table[window[k]] += 1; }
                            }
                            let max_key = 0;
                            let max_value = 0;
                            for (const key in freq_table) {
                                if(freq_table[key] > max_value) {
                                    max_key = key;
                                    max_value = freq_table[key];
                                }
                            }
                            d.data[i][1] = max_key;
                        }
                        // <<< 240720 hjkim - 윈도우내 최빈값 사용
                    } // 윈도우 사용 ------------
                    var r = [];
                    for(let i = 0; i < d.data.length; i++) {
                        if( (i+1 < d.data.length) ) {
                            if( (d.data[i][1] != d.data[i+1][1]) ) {
                            // if( (d.data[i][1] == 0 || d.data[i][1] == 15) && (d.data[i+1][1] != 0) && (d.data[i+1][1] != 15) ) {
                                time_flag[ d.data[i+1][0] ] = d.data[i+1][1];
                            }
                        }
                        r.push([d.data[i][0], d.data[i][1]]);
                    }
                    // console.log(r, time_flag);
                    return r;
                });
                port1.postMessage({msg: "CH1/(i)BOP_BARDATA", bardata: bop_bardata[0], 
                stime: stime, etime: etime, len: len, time_flag: time_flag});
                
                // 6. flot_data를 필터링 (STACK_BARDATA)
                 // IMPEDANCE DATA FETCH
                const imp_url = argv.data.imp_url;
                fetch(imp_url)
                .then(res => res.text())
                // .then(d => {console.log("data.js / before:", d); return d; })
                .then(txt => _extract_url(txt))
                .then(arr => arr.filter(d => d.includes(".txt")))
                // .then(d => {console.log("data.js / after1 :", d); return d; })
                .then((url_list) => {
                    var result = [];
                    for (var i_1 = 0; i_1 < url_list.length; i_1++) {
                        let url = url_list[i_1];
                        if(url.includes(".txt") == false) continue;
                        // ex) "d2023-05-22-15-36_imp_Data_열_열교환기출구_부안.txt"
                        if(url == null) throw "url 요소가 없습니다.";
                        let _sp = url.split("_imp_Data_");
                        let _prefix = _sp[0].slice(1);
                        if(_sp[1] == undefined) continue;
                        let _postfix = _sp[1].slice(0, -4);
                        if(_prefix.length != 16) continue;
                        //console.log(_prefix, _postfix);
                        let _t = _prefix.split("-");
                        var _ymd_hms = [_t[0],_t[1],_t[2]].join("-")+" "+[_t[3],_t[4]].join(":");
                        let _ts = new Date(_ymd_hms).getTime();
                        if(isNaN(_ts)) continue;
                        if(_ts < stime  || etime < _ts) continue;
                        // >>> 240226 hjkim - Draw Nyquist Plot
                        // /ALL/data/impedance/imp_data/d2024-02-20-12-46_imp_Data_정상_부안_stk2_40A.txt
                        if(url_list[i_1] == null) throw "url_list[i_1] 가 없습니다.";
                        let _url = `${imp_url}/${url_list[i_1]}`; 
                        // <<< 240226 hjkim - Draw Nyquist Plot
    
                        // >>> 240223 hjkim - meta-data for stack bar 드로잉
                        let obj = { timestamp: _ts, time: _ymd_hms, label: _postfix, url: _url };
                        // console.log("data.js / obj : ", obj);
                        result.push(obj);
                        // <<< 240223 hjkim - meta-data for stack bar 드로잉
                    }
                    return result;
                })
                .then(bardata => {
                    // console.log("data.js / _bardata : ", bardata);
                    port1.postMessage({msg: "CH1/(j)STACK_BARDATA", bardata: bardata, range: (etime-stime), timestamp_s: stime});
                });
            });
        break;
        case "CH1/(5)RAW_DATA_FETCH":
            // console.log(`!@#$ ${argv.data['msg']} ${argv.data['url']} ${argv.data['debug']}`);
            /* ------------------------------- NULL CHECK ------------------------------- */
            var IS_INVALID = false;
            if(is_string(argv.data["url"]) == false) { 
                console.error(`${argv.data.msg} 에서 url(${argv.data['url']}) 인자가 String 이 아닙니다.`);
                IS_INVALID|= true;
            }
            if(is_string(argv.data["response"] == false)) {
                console.error(`${argv.data.msg} 에서 url(${argv.data['url']}) 인자가 String 이 아닙니다.`);
                IS_INVALID|= true;
            }
            if(is_array(argv.data["column"]) == false) { 
                console.error(`${argv.data.msg} 에서 column(${argv.data['column']}) 인자가 Array 가 아닙니다.`);
                IS_INVALID|= true;
            }
            if(is_bool(argv.data["is_time"]) == false) {
                console.error(`${argv.data.msg} 에서 column(${argv.data['is_time']}) 인자가 Bool 가 아닙니다.`);
                IS_INVALID|= true;
            }
            argv.data["column"].forEach(colname => {
                if(VALID_COLNAME[colname] == undefined) {
                    console.error(`${argv.data.msg} 에서 column의 ${colname}이 유효한 컬럼명이 아닙니다.`);
                    IS_INVALID|= true;
                }
            });
            if(IS_INVALID) return;
            /* ------------------------------- NULL CHECK ------------------------------- */
            // FETCH PROCESS
            fetch(argv.data.url)
            .then( (res) => res.text())
            // .then( (txt) => {console.log("!@#$ !! txt : ", txt); return txt; })
            .then( (txt) => fn_csv_to_json(txt))
            // .then( (json) => {console.log("!@#$ !! json : ", json); return json; })
            .then( (json) => {
                if(argv.data["is_time"] == true) { return fn_json_to_flotdata_with_timestamp(json); }
                else { return fn_json_to_flotdata(json); }
            })
            // .then( (flotdata) => {console.log("!@#$ !! floatdata : ", flotdata); return flotdata; })
            .then( (flotdata) => {
                return flotdata.filter((d) => {
                    for(let i = 0; i < argv.data["column"].length; i+= 1) {
                        if(d.label == argv.data["column"][i]) { return true; }
                    } return false;
                });
            })
            // .then( (sel_flotdata) => {console.log("!@#$ !! sel_floatdata : ", sel_flotdata); return sel_flotdata; })
            .then( (sel_flotdata) => {
                port1.postMessage({msg: argv.data["response"], flotdata: sel_flotdata });
            });
        break;
        case "CH1/(5)RAW_DATA_FETCH_ALL":
            // console.log(`!@#$ ${argv.data['msg']} ${argv.data['url']} ${argv.data['debug']}`);
            /* ------------------------------- NULL CHECK ------------------------------- */
            var IS_INVALID = false;
            if(is_string(argv.data["url"]) == false) { 
                console.error(`${argv.data.msg} 에서 url(${argv.data['url']}) 인자가 String 이 아닙니다.`);
                IS_INVALID|= true;
            }
            if(is_string(argv.data["response"] == false)) {
                console.error(`${argv.data.msg} 에서 url(${argv.data['url']}) 인자가 String 이 아닙니다.`);
                IS_INVALID|= true;
            }
            if(is_bool(argv.data["is_time"]) == false) {
                console.error(`${argv.data.msg} 에서 column(${argv.data['is_time']}) 인자가 Bool 가 아닙니다.`);
                IS_INVALID|= true;
            }
            if(IS_INVALID) return;
            /* ------------------------------- NULL CHECK ------------------------------- */
            // FETCH PROCESS
            var header = [];
            fetch(argv.data.url)
            .then( (res) => res.text())
            .then( (txt) => {
                txt.trim().split("\n").map((row, i) => { 
                    col = row.split(",");
                    if(i == 0) { header = col; }
                });
                return txt;
            })
            .then( (txt) => fn_csv_to_json(txt))
            .then( (json) => {
                if(argv.data["is_time"] == true) { return fn_json_to_flotdata_with_timestamp(json); }
                else { return fn_json_to_flotdata(json); }
            })
            .then( (sel_flotdata) => {
                port1.postMessage({msg: argv.data["response"], flotdata: sel_flotdata, header: header });
            });
        break;
        case "CH1/(6)SIMPLE_FETCH":
            /* ------------------------------- NULL CHECK ------------------------------- */
            var IS_INVALID = false;
            if(is_string(argv.data["url"]) == false) { 
                console.error(`${argv.data.msg} 에서 url(${argv.data['url']}) 인자가 String 이 아닙니다.`);
                IS_INVALID|= true;
            }
            if(IS_INVALID) return;
            /* ------------------------------- NULL CHECK ------------------------------- */
            fetch(argv.data["url"]).then(res => res.json())
            .then(json => port1.postMessage({msg: argv.data["response"], json: json }));
        break;
        // >>> 240723 hjkim - 센서 레이블 데이터 가져오기
        case "CH2/(1)EVENT_CSV":
            let qs = `?cmd=${argv.data.cmd}`;
            if(argv.data.type != undefined) {
                qs+= `&type=${argv.data.type}`;
            }
            switch(argv.data.cmd) {
                case "UPDATE":
                    qs+= `&sdate=${argv.data.sdate}&edate=${argv.data.edate}`;
                    qs+= `&label=${argv.data.label}`;
                    break;
                case "SEARCH":
                    qs+= `&label=${argv.data.label}`;
                    break;
                default:
                    qs+= `&sdate=${argv.data.sdate}&edate=${argv.data.edate}`;
                    break;
            }
            fetch("/ALL/data/raw/_event.csv.php"+qs)
            .then( d => d.json())
            .then( json => json.reverse())
            .then( json => {
                let _status = "SUCCESS_"+argv.data.cmd;
                switch(argv.data.type) {
                    case "NORMAL":
                        port1.postMessage({msg: "CH2/(c)NORMAL_LABEL", status: _status, eventdata: json });
                        break;
                    default:
                        port1.postMessage({msg: "CH2/(a)SENSOR_LABEL", status: _status, eventdata: json });
                        break;
                }
            })
            .catch(json => {
                let _status = "FAIL_"+argv.data.cmd;
                switch(argv.data.type) {
                    case "NORMAL":
                        port1.postMessage({msg: "CH2/(c)NORMAL_LABEL", status: _status, eventdata: json });
                        break;
                    default:
                        port1.postMessage({msg: "CH2/(a)SENSOR_LABEL", status: _status, eventdata: json });
                        break;
                }
            });
        break;
        // <<< 240723 hjkim - 센서 레이블 데이터 가져오기
    }
}

var CACHED_POST_MSG = [];
function channel2_handler(argv, port1) {
    const M_OHM = 1000; // 단위 변환 상수    
    switch(argv.data.msg) {
		case "GET_BESTFIT":
            console.log("#data.js / GET_BESTFIT : ", CACHED_POST_MSG, argv.data.response_msg);
			CACHED_POST_MSG.map(msg_obj => {
				msg_obj.msg = argv.data.response_msg;
				port1.postMessage( msg_obj );
			});
		break;
        case "GET_STACK__STREAM":
            // >>> 240416 hjkim - 시계열 단위의 시각화 데이터
            var url_lists = fetch(argv.data.url_dir) // 폴더의 파일 목록 가져오기
            .then(res => res.text()) // 텍스트 형태로 변경
            .then(txt => _extract_url(txt)) // URL만 파싱
            .then(arr => arr.filter(d => d.includes(".txt"))); // .txt 확장자만 필터링
			var color_list = [];
            url_lists.then(url_arr => {
                // 1. 전처리부
                var mat_arr = url_arr.map(url => {
                    var full_url = `${argv.data.url_dir}/${url}`;
                    let _color = "#00FF00"; // 기본값
                
                    // >>> 정확한 색상 추출: {06D001} 와 같은 형식에서 추출
                    const color_match = full_url.match(/\{([0-9A-Fa-f]{6})\}/);
                    if (color_match) {
                        _color = `#${color_match[1]}`;
                    } else {
                        const label = ["유량센서", "MFM전누설", "MFM후누설", "공기부족", "공기과잉", "블로워", "수소부족", "수소과잉", "압력센서", "정상"];
                        const color = ["#EE0000",  "#252850",   "#B8B799",   "#0000EE", "#FFD700",  "#00A693", "#FFA500", "#FFA5FF", "#924E7D",  "#00FF00"];
                        const match_idx = label.map(l => full_url.indexOf(l) === -1 ? 65535 : full_url.indexOf(l));
                        const min_idx = match_idx.reduce((min, v, i, d) => (v < d[min] ? i : min), 0);
                
                        if (match_idx[min_idx] !== 65535) {
                            _color = color[min_idx];
                        }
                    }
                    // <<< 정확한 색상 추출
                
                    color_list.push(_color);
                
                    var mat = fetch(full_url)
                        .then(res => res.text())
                    // 1.1 e단위 변환 및 y값 반전
                        .then(txt => {
                            let r = _parse_imp_data(txt, (arr) => {
                                arr[1] *= M_OHM;        // x: Real Imp.
                                arr[2] *= M_OHM * -1;   // y: -Imag Imp.
                            });
                            return r;
                        })
                        .then(data => data.filter(d => d[2] > 0)); // y값이 양수인 것만
                    return mat;
                });                

                // 2. URL 목록의 최대 최소 값 구하기
                var zxy_axis_min = [65535, 65535, 65535];
                var zxy_axis_max = [-1, -1, -1];
                // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
                var zxy_max_upper = [-1, -1, -1];
                function get_upper_value(value) {
                    if (value <= 0) {
                        return 10;
                    } else {
                        const scale = Math.ceil(value / 500) * 500;
                        return scale;
                    }
                }
                // <<< 250321 hjkim - x,y 축 최대값 올림값 산출
                var _ack_number = 0;
                // >>> 240927 hjkim - xsxeysye 사용 체크박스
                //if(argv.data.xs == undefined || argv.data.xe == undefined || argv.data.ys == undefined || argv.data.ye == undefined) {
        				// <<< 240927 hjkim - xsxeysye 사용 체크박스
        				// >>> 250328 hjkim - 초기화 이후에 max값을 계산 안하는 버그 수정
        				if(1) {
                // >>> 250328 hjkim - 초기화 이후에 max값을 계산 안하는 버그 수정
                    // min_x, min_y, max_x, max_y 가 안주어질 경우,
                    Promise.all(mat_arr)
                    .then(mat_arr => {
                        // console.log("#data.js / mat_arr : ", mat_arr);
                        mat_arr.map(mat => mat.map(row => {
                            
                            if(zxy_axis_min[0] > row[0]) zxy_axis_min[0] = row[0];
                            if(zxy_axis_min[1] > row[1]) zxy_axis_min[1] = row[1];
                            if(zxy_axis_min[2] > row[2]) zxy_axis_min[2] = row[2];
                            
                            if(zxy_axis_max[0] < row[0]) zxy_axis_max[0] = row[0];
                            if(zxy_axis_max[1] < row[1]) zxy_axis_max[1] = row[1];
                            if(zxy_axis_max[2] < row[2]) zxy_axis_max[2] = row[2];
                        }) );
                        return mat_arr;
                    })
                    .then(mat_arr => {
                        // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
                        /*zxy_max_upper[0] = get_upper_value(zxy_axis_max[0]);
                        zxy_max_upper[1] = get_upper_value(zxy_axis_max[1]);
                        zxy_max_upper[2] = get_upper_value(zxy_axis_max[2]);*/
                        // <<< 250321 hjkim - x,y 축 최대값 올림값 산출
                 				// >>> 250328 hjkim - 초기화 이후에 max값을 계산 안하는 버그 수정
            						zxy_max_upper[0] = zxy_axis_max[0];
                        zxy_max_upper[1] = zxy_axis_max[1];
                        zxy_max_upper[2] = zxy_axis_max[2];
                        // <<< 250328 hjkim - 초기화 이후에 max값을 계산 안하는 버그 수정

                        CACHED_POST_MSG = [];
                        mat_arr.map((data, idx) => {
                            // console.log("#data.js / data : ", data);    
                            var msg_obj = { 
                            msg: argv.data.response_msg, /* DRAW_NYQUIST | DRAW_NYQUIST__RELATIVE */
                            data: data, 
                            color: color_list[idx], 
                            compact: argv.data.compact, 
                            // stats: desc_stats, 
                            ack_number: _ack_number++,
                            zxy_axis_min: zxy_axis_min,
                            zxy_axis_max: zxy_axis_max,
                            min_x: zxy_axis_min[1], 
                            min_y: zxy_axis_min[2], 
                            max_x: zxy_axis_max[1], 
                            max_y: zxy_axis_max[2],
                            // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
                            xaxis_max: zxy_max_upper[1],
                            yaxis_max: zxy_max_upper[2],
                            // <<< 250321 hjkim - x,y 축 최대값 올림값 산출
                            };
                            CACHED_POST_MSG.push(msg_obj);
                            port1.postMessage( msg_obj );
                        });
                    });
                // >>> 240927 hjkim - xsxeysye 사용 체크박스
                } else {
                    // min_x, min_y, max_x, max_y 가 주어질 경우,
                    Promise.all(mat_arr)
                    .then(mat_arr => {
                        // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
                        zxy_max_upper[0] = 0;
                        zxy_max_upper[1] = get_upper_value(argv.data.xe);
                        zxy_max_upper[2] = get_upper_value(argv.data.ye);
                        // <<< 250321 hjkim - x,y 축 최대값 올림값 산출

                        CACHED_POST_MSG = [];
                        mat_arr.map((data, idx) => {
                            // console.log("#data.js / data : ", data);    
                            var msg_obj = { 
                            msg: argv.data.response_msg, /* DRAW_NYQUIST | DRAW_NYQUIST__RELATIVE */
                            data: data, 
                            color: color_list[idx], 
                            compact: argv.data.compact, 
                            // stats: desc_stats, 
                            ack_number: _ack_number++,
                            zxy_axis_min: zxy_axis_min,
                            zxy_axis_max: zxy_axis_max,
                            min_x: argv.data.xs, 
                            min_y: argv.data.ys, 
                            max_x: argv.data.xe, 
                            max_y: argv.data.ye,
                            // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
                            xaxis_max: zxy_max_upper[1],
                            yaxis_max: zxy_max_upper[2],
                            // <<< 250321 hjkim - x,y 축 최대값 올림값 산출
                            };
                            CACHED_POST_MSG.push(msg_obj);
                            port1.postMessage( msg_obj );
                        });
                    });
                }
                // <<< 240927 hjkim - xsxeysye 사용 체크박스
            });
        break;
        case "GET_STACK_NORM_RCNT":
            // >>> 스택 상태 그래프 데이터
            const normal_url = argv.data.upper_url[0];
            const recent_url = argv.data.upper_url[1];
            var _ack_number = 0;
            // 최근 데이터
            fetch(recent_url)
            .then(res => res.text())
            .then(txt => _extract_url(txt))
            .then(arr => arr.filter(d => d.includes(".txt")))
            .then((d, idx) => {
                console.log("!@#$ d : ", d);
                // DRAW_IMPDATA (=> imp.js)
                d.map(_u => {
                    var _color = "#0000CC";
                    var _url = `${recent_url}/${_u}`;
                    // >>> 240417 hjkim - 그래프와 DATA의 분리
                    fetch(_url)
                    .then(res => res.text())
                    .then(txt => {
                        var data = _parse_imp_data(txt, (arr) => {
                            arr[1] *= M_OHM;        // x: Real Imp.
                            arr[2] *= M_OHM * -1;   // y: -Imag Imp.
                        });
                        // >>> 240418 hjkim - y축이 0 이상인 것만 사용
                        var _data = data.filter(d => d[2] > 0);
                        // <<< 240418 hjkim - y축이 0 이상인 것만 사용
                        port1.postMessage( { msg: argv.data.response_msg, data: _data, color: _color, 
                            ack_number: _ack_number++ });
                    });
                    // <<< 240417 hjkim - 그래프와 DATA의 분리
                    // port1.postMessage( { msg: "DRAW_IMPDATA", url: _url, color: _color } );
                });
            });
            // 정상 데이터
            fetch(normal_url)
            .then(res => res.text())
            .then(txt => _extract_url(txt))
            .then(arr => arr.filter(d => d.includes(".txt")))
            .then(d => {
                // DRAW_IMPDATA (=> imp.js)
                d.map(_u => {
                    var _color = "#00FF00";
                    var _url = `${normal_url}/${_u}`;
                    // >>> 240417 hjkim - 그래프와 DATA의 분리
                    fetch(_url)
                    .then(res => res.text())
                    .then(txt => {
                        var data = _parse_imp_data(txt, (arr) => {
                            arr[1] *= M_OHM;        // x: Real Imp.
                            arr[2] *= M_OHM * -1;   // y: -Imag Imp.
                        });
                        // >>> 240418 hjkim - y축이 0 이상인 것만 사용
                        var _data = data.filter(d => d[2] > 0);
                        // <<< 240418 hjkim - y축이 0 이상인 것만 사용
                        port1.postMessage( { msg: argv.data.response_msg, data: _data, color: _color, 
                            ack_number: _ack_number++ });
                    });
                    // <<< 240417 hjkim - 그래프와 DATA의 분리
                    // port1.postMessage( { msg: "DRAW_IMPDATA", url: _url, color: _color } );
                });
            });
            // <<< 스택 상태 그래프 데이터
            
            // // >>> 스택 상태 그래프 (UPLOT)
            // fetch(recent_url)
            // .then(res => res.text())
            // .then(txt => _extract_url(txt))
            // .then(arr => arr.filter(d => d.includes(".txt")))
            // .then(d => {
            //     d.map(_u => {
            //         var _color = "#0000CC";
            //         var _url = `${recent_url}/${_u}`;
            //         fetch(_url)
            //         .then(res => res.text())
            //         .then((txt:string) => txt.trim().split("\n"))
            //         .then((row:string[]) => {
            //             var x_arr = row.reduce((acc, d, i) => {
            //                 var c = d.trim().split(" ");
            //                 acc.push(c[1]);
            //                 return acc;
            //             }, []);
            //             var y_arr = row.reduce((acc, d, i) => {
            //                 var c = d.trim().split(" ");
            //                 acc.push(-c[2]);
            //                 return acc;
            //             }, []);
            //             return [null, [x_arr, y_arr]];
            //         })
            //         .then(result => {
            //             console.log("data.js / result : ", result);
            //             const _opt = { stroke: "red", fill: "rgba(255,0,0,0.1)", paths: drawPoints.toString(), };
            //             port1.postMessage({msg: "UPLOT_IMPDATA", data: result, opt: _opt});
            //         });
            //     });
            // });
            // <<< 스택 상태 그래프 (UPLOT)
        break;
        case "GET_LIST":
            const word = argv.data.word;
            // 변수 선언부
            var filter_list1_stack = {}, filter_list2_amp = {};
            // FilterList
            fetch(argv.data.url)
            .then(res => res.text())
            .then(txt => _extract_url(txt))
            .then((arr         ) => arr.filter(d => d.includes(word)) )
            .then((arr         ) => {
                if(word == "stk") port1.postMessage( { msg: argv.data.response_msg[0], list:arr } );
                if(word == "A")   port1.postMessage( { msg: argv.data.response_msg[1], list:arr } );
            });
        break;
        case "HZ_DATAFETCH":
            // >>> HZ 그래프 데이터
                                                            // (1) [x-values(timestamp)] : filename
                                                            // (2) [label(__HZ)] : [y-values(900~개)]
                                                                                                                                  // (3)
                                            // (4) [ [x-values(unixtime)],[y-values(real ohm)],[...] ]
            // 변수 선언부
            var x2filename                   = {}, label2y                = {};
            var output_opt             = [], output_data              = [];
            const re = /post_d([0-9-]+)_imp_Data_.*._(stk[0-9]+)_([0-9]+A).*.txt/gi;
            // Data Fetch
            const base_url = argv.data.url;
            fetch(base_url)
            .then(res => res.text())
            .then(txt => _extract_url(txt))
            .then((arr         ) => arr.filter(d => d.includes("_imp_Data_") && d.includes(".txt")))
            .then((arr         ) => arr.sort())
            .then((arr         ) => {
                // (1) 제작
                arr.map((filename       ) => {
                    var matches = filename.matchAll(re);
                    // >>> MATCH GROUP n
                    var match_grp1 = "";
                    for(const match of matches) { 
                        if(match[1] != undefined) match_grp1 = match[1]; 
                    }
                    // <<< MATCH GROUP n
                    var tmp = match_grp1.split("-");
                    let ymd_hm = [tmp[0], tmp[1], tmp[2]].join("-")+" "+[tmp[3], tmp[4]].join(":");
                    let ts = new Date(ymd_hm).getTime().toString();
                    let unixtime = (ts/1000).toString();
                    if(x2filename[unixtime] == undefined) x2filename[unixtime] = [];
                    x2filename[unixtime].push(filename);
                });
                return arr.map((filename       ) => {
                    // console.log("data.js / filename : ", filename);
                    return fetch(`${base_url}/${filename}`)
                    .then(res => res.text())
                    .then((txt       ) => txt.trim().split('\n'))
                    .then((row         ) => { 
                        // >>> (2) 제작
                        row.map(r => {
                            var c = r.trim().split(" ");
                            const hz = c[0];
                            const yval = Number(c[1]);
                            if(hz == "") return;
                            // >>> label2y 생성
                            if(label2y[hz] == undefined) label2y[hz] = [];
                            label2y[hz].push(yval);
                            // <<< label2y 생성
                        });
                        // <<< (2) 제작
                        return row;
                    })
                    // .then(debug => { console.log("data.js / debug : ", debug); return debug;})
                    .then((row         ) => {
                        return row.reduce((acc, d, i) => {
                            var c = d.trim().split(" ");
                            acc.push(c);
                            return acc;
                        }, []);
                    });
                });
            })
            .then((done          ) => {
                Promise.all(done)
                .then((dim_arr            /* 1058 x 60 x 3 */) => {
                    // >>> (3)제작
                    output_opt = Object.keys(label2y).reduce((acc, real_ohm, i) => {
                        acc.push({
                            show: true,
                            spanGaps: false,
                            label: Number(real_ohm).toFixed(2) + " Hz",
                            scale: "y",
                            stroke: color_palette[i],
                            width: 1,
                        });
                        return acc;
                    }, [{}]);
                    // <<< (3)제작
                    port1.postMessage( { msg: argv.data.response_msg[0], uplotopt_series: output_opt });
                    // >>> (4)제작
                    // >>> xval(timestamp)
                    var x_arr = Object.keys(x2filename);
                    for(var i = 0; i < x_arr.length; i++) x_arr[i] = Number(x_arr[i]);
                    // output_data.push(x_arr);
                    // <<< xval(timestamp)

                    // >>> xval(일련번호)
                    var serial_number = [];
                    for(var i = 0; i < dim_arr.length; i++) {
                        serial_number.push(i);
                    }
                    output_data.push(serial_number);
                    // <<< xval(일련번호)

                    var labels = Object.keys(label2y);
                    for(var i = 0; i < labels.length; i++) {
                        let d = label2y[labels[i]];
                        output_data.push(d);
                    }
                    // <<< (4)제작
                    port1.postMessage( { msg: argv.data.response_msg[1], uplotdata: output_data, tooltipdata: x2filename });
                });
            });
            // <<< HZ 그래프 데이터
        break;
        case "STACK_GET":
        break;
    }
}

function channel3_handler(argv, port1) {
    // console.log("data.js / channel3_handler / argv : ", argv);
    switch(argv.data.msg) {
        case "CH3/(1)GET_DIR":
            const response = argv.data.response;
            var url = argv.data.url;
            url = url.replaceAll("//", "/");
            fetch(url)
            .then(res => res.text())
            .then(txt => _extract_url(txt))
            .then(include => include.filter((d       ) => (d.includes(".csv") && !d.includes(".gz") && !d.includes(".bak")) || /[0-9]+.*\//.exec(d)))
            .then(list => { 
				if(response == "CH3/(c)TIMELY_LIST") { 
					list.sort((a,b) => {
						if(a.includes("residual")) return -1;
						else return 0;
					});
				}
				port1.postMessage({msg: response, list: list}); 
			});
        break;
    }
}

/* -------------------------------------------------------------------------- */
/*                             UPLOT FUNCITON SET                             */
/* -------------------------------------------------------------------------- */
const drawPoints = (u, seriesIdx, idx0, idx1) => {
    const pxRatio = 1.5;
    const size = 5 * pxRatio;
    uPlot.orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim, moveTo, lineTo, rect, arc) => {
        let d = u.data[seriesIdx];
        u.ctx.fillStyle = series.stroke();
        let deg360 = 2 * Math.PI;
        console.time("points");
        let p = new Path2D();

        for (let i = 0; i < d[0].length; i++) {
            let xVal = d[0][i];
            let yVal = d[1][i];

            if (xVal >= scaleX.min && xVal <= scaleX.max && yVal >= scaleY.min && yVal <= scaleY.max) {
                let cx = valToPosX(xVal, scaleX, xDim, xOff);
                let cy = valToPosY(yVal, scaleY, yDim, yOff);

                p.moveTo(cx + size/2, cy);
                arc(p, cx, cy, size/2, 0, deg360);
            }
        }
        console.timeEnd("points");
        u.ctx.fill(p);
    });
    return null;
};

/* -------------------------------------------------------------------------- */
/*                              UTIL FUNCTION SET                             */
/* -------------------------------------------------------------------------- */

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

function _extract_url(txt        ) {
    var r = [];
    var re = /<a href="(.+)">(.+)<\/a>/g;
    var matches = txt.matchAll(re);
    for(const match of matches) {
        // if(match[1] != undefined) r.push(match[1]);
        if(match[2] != undefined) r.push(match[2]);
    }
    return r;
}

function _parse_imp_data(d, cb) {
    var r = [];
    var arr = d.split("\n");
    for (var i = 0; i < arr.length; i++) {
        var arr_arr = [];
        arr_arr = arr[i].split(" ");
        
        var z = Number(arr_arr[0]);
        var x = Number(arr_arr[1]);
        var y = Number(arr_arr[2]);
        var arr_arr_n = [z, x, y];
        
        cb(arr_arr_n);
        r.push(arr_arr_n);
    }
    return r;
}

function fetch_node_info(url       , lv       , map      , _signal            )           {
    console.log("!@#$ url, lv :", url, lv);
    return fetch(url, { signal: signal2 })
    .then(res => res.text())
    .then(txt => _extract_url(txt))
    .then(include => {
        console.log("!@#$ include : ", include);
        if(lv == 3) return include.filter((d) => (!d.includes(".csv")));
        else return include;
    })
    // .then(include => include.filter((d:string) => (d.includes(".csv") && !d.includes(".gz")) || /[0-9]+\//.exec(d)))
    // .then(d => {console.log("data.js / before:", d); return d; })
    .then(include => {
        // console.log("data.js / url :", url);
        // >>> 240826 hjkim - 경로변경
        // if(url == "/ALL/data" || url == "/ALL/data/") 
        const re = /\/data\/.*\/BOP\/$/;
        const re2 = /\/data\/.*\/BOP\/..\/$/;
        var m = url.match(re);
        var m2 = url.match(re2);
        if(m != null)  { // 년단위 폴더
        // <<< 240826 hjkim - 경로변경            
            var r = include.filter((d       ) => /^[0-9]{4}\//.exec(d) );
            return r;
        } else if(m2 != null) { //월,일단위 폴더
            var r = include.filter((d       ) => /^[0-9]{2}\//.exec(d) );
            return r;
        } else {
            var r = include.filter((d       ) => {
                return (d.includes(".csv") && !d.includes(".gz")) || /[0-9]+.*\//.exec(d);
            });
            return r;
        }
    })
    // .then(d => {console.log("data.js / after:", d); return d; })
    // .then(exclude => exclude.filter((d:string) => (d != "Buan" || d != "Daejeon" || !d!= "impedance" || d != "raw")))
    // .then(d => {console.log("data.js / after :", d); return d; })
    .then(postfix_list => postfix_list.map(postfix => { 
        if(map[url] == undefined) map[url] = [];
        map[url].push(postfix); 
        return `${url}/${postfix}`; 
    }) )
    // .then(d => {console.log("data.js / after2 :", d); return d; })
    .then(declutter_list => declutter_list.map(d => d.replaceAll("//", "/")))
    // .then(d => {console.log("data.js / after3 :", d); return d; })
}

/* -------------------------------------------------------------------------- */
/*                          BOP_BARDATA FUNCTION SET                          */
/* -------------------------------------------------------------------------- */
function fn_get_group(n) {
    if(n == 0) return 1;
    else if(1 <= n && n < 6) return 2;
    else if(6 <= n && n < 9) return 3;
    else if(9 <= n && n < 15) return 4;
    else return 5;
}

/* -------------------------------------------------------------------------- */
/*                         BOP_DATA_FETCH FUNCTION SET                        */
/* -------------------------------------------------------------------------- */
var fn_json_to_flotdata = (json) => {
    var flotdata = [];
    var header = Object.keys(json[0]);
    // >>> 컬럼 순회
    for (var i = 0; i < header.length; i += 1) {
        var k = header[i];
        // series : { label : "sth", data : [ [x,y], ...]}
        // series : { label : "sth", data : [ [x,y], ...], yaxis: 2}
        // series : { label : "sth", data : [ [x,y], ...], yaxis: 2, color: "#EFEFEF" }
        var series = { label: k, data: [], color: color_palette[i] };
        // >>> 행 순회
        for (var j = 0; j < json.length; j += 1) { series.data.push([j, json[j][k]]); }
        // <<< 행 순회
        flotdata.push(series);
    }
    // <<< 컬럼 순회
    return flotdata;
}

var fn_json_to_flotdata_with_timestamp = (json                 ) => {
    // console.log("data.js / json : ", json);
    var flotdata              = [];
    var header = Object.keys(json[0]);
    var prev_t        = 0;
    // >>> 컬럼 순회
    for (var i = 2; i < header.length; i += 1) {
        var k = header[i];
        // series : { label : "sth", data : [ [x,y], ...]}
        // series : { label : "sth", data : [ [x,y], ...], yaxis: 2}
        // series : { label : "sth", data : [ [x,y], ...], yaxis: 2, color: "#EFEFEF" }
        var series             = { label: "sth", data: [], color: "#ebebeb" };
        let _color = color_palette[i];
        if (k.includes("kPa")) series = { label: k, data: [], color: _color, yaxis: 2 };
        else series = { label: k, data: [], color: _color };
        
        // >>> 행 순회
        for (var j = 0; j < json.length; j += 1) {
            var t;
            let _hms = json[j]["Time"].split("-").join(":");
            let _ymd_hms = json[j]["Date"]+" "+_hms;
            let _ts = new Date(_ymd_hms).getTime();
            series.data.push([_ts, json[j][k]]);
        }
        // <<< 행 순회

        flotdata.push(series);
    }
    // <<< 컬럼 순회
    return flotdata;
}

var fn_csv_to_json = (txt        ) => {
    var header_name          ;
    var col          ;
	// >>> 240529 hjkim - carrige return bugfix
    //return txt.trim().split("\r\n")
	return txt.trim().split("\n")
	// <<< 240529 hjkim - carrige return bugfix
    .map((row, i) => {
        var kv = {};
        col = row.split(",");
        if(i == 0) { header_name = col; }
        if(i != 0) { col.map((c, j) => kv[header_name[j]] = c); }
        return kv;
    })
    .reduce((acc, d, i) => {
        if(i == 0) { return acc; }
        else { acc.push(d); return acc; }
    }, []);
}
var fn_parse_csv_into_mapped_json = (txt        ) => {
    var header_name          ;
    var col          ;
	// >>> 240529 hjkim - carrige return bugfix
    //return txt.trim().split("\r\n")
	return txt.trim().split("\n")
	// <<< 240529 hjkim - carrige return bugfix
    .map((row, i) => {
        var kv                     = {};
        col = row.split(",");
        if(i == 0) { header_name = col; }
        if(i != 0) { 
            col.map((c, j) => kv[header_name[j]] = c); 
        }
        // console.log("data.js / kv : ", kv);
        return kv;
    })
    .reduce((acc, d, i) => {
        if(i == 0) { return acc; }
        else { acc.push(d); return acc; }
    }, []);
}

/* -------------------------------------------------------------------------- */
/*                           DASHBOARD FUNCTION SET                           */
/* -------------------------------------------------------------------------- */

function dfs_with_backtracking(url       , path       , lv       , cb_done          ) {
    // console.log("data.js / url: ", url);
    lv++;
    path.history.push(url); // 방문한 노드 표시
    return fetch_node_info(url, lv, path.map, signal) // 현재 노드 정보를 비동기적으로 가져옴
    .then((url_list) => {
        url_list = url_list.sort().reverse();
        path.map_full[url] = url_list;
        // console.log("data.js / Node:", url_list, "Lv:", lv);
        if(url_list == null) return "취소";
        for(var i = url_list.length-1; 0 <= i; i--) {
            if(`${url_list[i]}`.includes(".csv") == true) { // 종료 조건
                if(abort_once1) { 
                    abort_once1 = false; 
                    setTimeout(() => { controller.abort(); }, 1); 
                }
                // console.log(`data.js / TODO: ${url_list[i]}로 그래프 로딩 할 것.`, path);
                cb_done(url_list[i], path);
                return "그래프 로딩"; 
            }
            dfs_with_backtracking(url_list[i], path, lv, cb_done);
        }
    })
    .catch(err => {
        if(err.name == "AbortError") { console.log(`${url}의 fetch를 취소했습니다.`); }
        else { console.error('Fetch 오류:', err); }
    });
}

/* -------------------------------------------------------------------------- */
/*                              BOP FUNCTION SET                              */
/* -------------------------------------------------------------------------- */
const YEARLY_TIMESLOT = 1000;
const MONTHLY_TIMESLOT = 12/YEARLY_TIMESLOT;
const DAILY_TIMESLOT = 31/MONTHLY_TIMESLOT;
const RTT = 1000;
function dfs_with_backtracking___bop(url       , path       , lv       , cb_done          ) {
    lv++;
    path.history.push(url); // 방문한 노드 표시
    return fetch_node_info(url, lv, path.map, signal2) // 현재 노드 정보를 비동기적으로 가져옴
    .then((url_list         ) => {
        url_list = url_list.sort().reverse();
        // console.log("data.js / url_list(sorted) : ", url_list);
        var i = 0;
        url_list.map((_url) => {
            console.log("!@#$ url : ", url);
            // 종료 조건1: .csv 파일인가?
            if( _url.includes(".csv") == true ) {
                const _controller = new AbortController();
                const _signal = _controller.signal;
                fetch( _url, { signal: _signal } )
                .then( res => res.body.getReader().read() ) // 스트림리더
                .then( read => {
                    const header = new TextDecoder().decode(read.value).split('\n')[0];
                    _controller.abort(); // 첫째줄만 읽고 중지!!!
                    if(header.includes("R_")) { // 종료조건2 : 컬렴명에 'R_'가 있는가?
                        // console.log("data.js / R_이 있는 url: ", {header : header, url : _url});
                        controller2.abort(); // fetch 일괄취소
                        cb_done(_url, path);
                        return "그래프 로딩"; 
                    } else {
                        // console.log("data.js / R_이 없는 url: ", {header : header, url : _url});
                    }
                    return header;
                 }); // 첫째줄(컬럼헤더)
            }
            // >>> TIME SLICE SORTING
            var priority = 0;
            const YEARLY_TIMESLOT   = 365;
            const MONTHLY_TIMESLOT  = (YEARLY_TIMESLOT/12);
            const DAILY_TIMESLOT    = (MONTHLY_TIMESLOT/30);
            if(lv == 1)         /* yearly */        priority = i * YEARLY_TIMESLOT;
            else if(lv == 2)    /* monthly (0~12) */priority = i * MONTHLY_TIMESLOT;
            else if(lv == 3)    /* daily (0~31) */  priority = i * DAILY_TIMESLOT;
            else                /* .csv */          priority = i;
            // console.log("data.js / priority : ", priority);
            setTimeout(() => { dfs_with_backtracking___bop(_url, path, lv, cb_done); }, priority);
            i++;
            // >>> TIME SLICE SORTING
        });
    })
    .catch(err => {
        if(err.name == "AbortError") { console.log(`${url}의 fetch를 취소했습니다.`); }
        else { console.error('Fetch 오류:', err); }
    });
}

// signal2.addEventListener('abort', () => {
//     console.log('data.js / signal2 Aborted? ', signal2.aborted);
// });

/* -------------------------------------------------------------------------- */
/*                              COLOR PALETTE SET                             */
/* -------------------------------------------------------------------------- */
var color_palette = ["#3ca7b9", "#388d9e", "#347483", "#305766", "#be4643", "#d35f47", "#e67549", "#e58e52", "#e3a65c", "#b0bc83", "#1395ba", "#117899", "#0f5b78", "#0d3c55", "#c02e1d", "#d94e1f", "#f16c20", "#ef8b2c", "#ecaa38", "#a2b86c", "#00cef1", "#00b0d2", "#008fb3", "#006b92", "#ff0600", "#ff3f17", "#ff682e", "#ff8837", "#ffa83e", "#cceb51", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666", "#88C3FF", "#4471A5", "#A84542", "#87A34D", "#D9823C", "#70578D", "#EACC00", "#91A7CD", "#76616A", "#337687", "#B04871", "#B46D3D", "#339999", "#CC9900", "#5B1A51", "#E76B08", "#2B5556", "#4677CD", "#3B2A31", "#243444", "#6085B0", "#B3615F", "#97AE67", "#DB935A", "#846F9C", "#E8CD29", "#A2B4D2", "#88777F", "#528896", "#B96485", "#BB815A", "#52A5A5", "#CEA328", "#703B67", "#E57F2E", "#4A6C6D", "#638BD1", "#55484E", "#8AB9C5", "#42505D", "#666666"];