    const styleTag = document.createElement("style");
    const headerInfo = {title: '디알퓨얼셀 PoC 리포트', duration: '2025-02-06 ~ 2025-03-18', sn: 'FR20250301'}
    const footerInfo = {copyright: '@2025 H2Systems Inc. All rights reserved.'}
    styleTag.innerHTML = 
        `@page {

            size: A4;
            margin-top: 30mm;
            margin-bottom: 20mm;
            background: white;
            @top-center {
                content: url("data:image/svg+xml,%3Csvg width='190mm' height='92' viewBox='0 0 960 92' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='TOP'%3E%3Crect id='bg' y='8' width='960' height='84' fill='%23127CA9' fill-opacity='0.05'/%3E%3Crect id='top-border' width='960' height='8' fill='%23127CA9'/%3E%3Ctext id='sn' fill='black' xml:space='preserve' style='white-space: pre' font-family='Noto Sans KR' font-size='16' letter-spacing='0em'%3E%3Ctspan x='846.016' y='64.9'%3E${headerInfo.sn}%3C/tspan%3E%3C/text%3E%3Ctext id='REPORT ID' fill='%23127CA9' xml:space='preserve' style='white-space: pre' font-family='Noto Sans KR' font-size='14' font-weight='bold' letter-spacing='0em'%3E%3Ctspan x='861.994' y='42.1'%3EREPORT ID%3C/tspan%3E%3C/text%3E%3Ctext id='duration' fill='black' xml:space='preserve' style='white-space: pre' font-family='Noto Sans KR' font-size='16' letter-spacing='0em'%3E%3Ctspan x='639.781' y='64.9'%3E${headerInfo.duration}%3C/tspan%3E%3C/text%3E%3Ctext id='DATE' fill='%23127CA9' xml:space='preserve' style='white-space: pre' font-family='Noto Sans KR' font-size='14' font-weight='bold' letter-spacing='0em'%3E%3Ctspan x='785.055' y='42.1'%3EDATE%3C/tspan%3E%3C/text%3E%3Ctext id='title' fill='black' xml:space='preserve' style='white-space: pre' font-family='Noto Sans KR' font-size='32' font-weight='bold' letter-spacing='0em'%3E%3Ctspan x='24.5625' y='62.4357'%3E${headerInfo.title}%3C/tspan%3E%3C/text%3E%3C/g%3E%3C/svg%3E");
            };
            @bottom-left {
                content: url(img/bi.svg);
                width: 120px;
                }
            @bottom-center {
                content: '${footerInfo.copyright}';
                font-size: 0.75rem;
                color: #777;
            };
            @bottom-right {
                content: counter(page, decimal-leading-zero);
                font-size: 1.5rem;
                font-weight: 700;
                color: #127CA9;
            };
        }`;
    document.head.appendChild(styleTag);
