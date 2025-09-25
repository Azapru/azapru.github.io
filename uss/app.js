const fileInput = document.getElementById("fileInput");
const output = document.getElementById("output");
const downloadTxt = document.getElementById("downloadTxt");
const checkWhiteListBtn = document.getElementById("checkWhiteListBtn");

let lastRows = [];

function escapeHtml(s){ return (s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

function summaryText(rows) {
    const lines = ["No. | Name | IBAN | Amount", "-".repeat(80)];
    for (const r of rows) lines.push(`${r.no.toString().padStart(2," ")} | ${r.name} | ${r.iban} | ${r.amount}`);
    return lines.join("\n");
}

function download(filename, text) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], {type:"text/plain;charset=utf-8"}));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function renderTable(rows) {
    if (!rows || rows.length === 0) {
        output.innerHTML = "<p>No <code>CdtTrfTxInf</code> entries found.</p>";
        return;
    }
    let html = "<table><thead><tr><th>No.</th><th>Name</th><th>IBAN</th><th>Amount</th></tr></thead><tbody>";
    for (const r of rows) {
        html += `<tr id="no${r.no}"><td>${r.no}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.iban)}</td><td>${escapeHtml(r.amount)}</td></tr>`;
    }
    html += "</tbody></table>";
    output.innerHTML = html;
}

function xpathNode(context, xpath) {
    const doc = (context && context.nodeType === Node.DOCUMENT_NODE) ? context : (context && context.ownerDocument) ? context.ownerDocument : document;
    const res = doc.evaluate(xpath, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return res ? res.singleNodeValue : null;
}

function getCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}

checkWhiteListBtn.addEventListener("click", async () => {
    try {
        const promises = lastRows.map(row => {
            const iban = row["iban"].replace(/\D/g, "");
            const no = row["no"];
            
            const url = "https://wl-api.mf.gov.pl/api/search/bank-account/" + iban + "?date=" + getCurrentDate();

            return fetch(url)
                .then(response => {
                    if (!response.ok) {
                        msg_show("Error", response.statusText, "OK")
                        throw new Error("Error: " + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    const status = data?.result?.subjects?.[0]?.statusVat;
                    if ((status ?? '').trim().toLowerCase() !== 'czynny') {
                        // NOT active
                        document.getElementById("no" + no).style.backgroundColor = "#631717";
                    }
                }
            );
        });

        await Promise.all(promises);

        snackbar_show("Checking white list finished!", "OK", 3)
    } catch (error) {
        console.error("Error: " + error);
    }
});

async function parseFile(file) {
    if (!file) return;
    const text = await file.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");
    if (doc.getElementsByTagName("parsererror").length) {
        msg_show("Error", "There was an error parsing XML", "OK");
        output.innerHTML = "";
        downloadTxt.disabled = true;
        checkWhiteList.disabled = true;
        lastRows = [];
        return;
    }

    const txs = doc.evaluate("//*[local-name()='CdtTrfTxInf']", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const rows = [];
    for (let i = 0; i < txs.snapshotLength; i++) {
            const tx = txs.snapshotItem(i);
            const no = i + 1;
            const nameNode = xpathNode(tx, ".//*[local-name()='Cdtr']/*[local-name()='Nm']");
            const ibanNode = xpathNode(tx, ".//*[local-name()='CdtrAcct']//*[local-name()='IBAN']");
            const amtNode = xpathNode(tx, ".//*[local-name()='InstdAmt']");

            const name = nameNode ? (nameNode.textContent||"").trim() : "";
            const iban = ibanNode ? (ibanNode.textContent||"").trim() : "";
            let amount = "";
            if (amtNode) {
            const v = (amtNode.textContent||"").trim();
            const ccy = amtNode.getAttribute("Ccy") || "";
            amount = `${v}${ccy ? " " + ccy : ""}`.trim();
        }

        rows.push({no, name, iban, amount});
    }

    lastRows = rows;
    renderTable(rows);
    downloadTxt.disabled = rows.length === 0;
    checkWhiteListBtn.disabled = rows.length === 0;
}

fileInput.addEventListener("change", () => {
    const f = fileInput.files && fileInput.files[0];
    parseFile(f);
});

downloadTxt.addEventListener("click", () => {
    if (!lastRows || lastRows.length === 0) return;
    const base = (fileInput.files[0] && fileInput.files[0].name.replace(/\.xml$/i,"") ) || "sepa";
    download(base + "-summary.txt", summaryText(lastRows));
});
