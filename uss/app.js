const fileInput = document.getElementById("fileInput");
const output = document.getElementById("output");
const downloadTxt = document.getElementById("downloadTxt");

let lastRows = [];

function escapeHtml(s){ return (s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

function summaryText(rows){
    const lines = ["No. | Name | IBAN | Amount", "-".repeat(80)];
    for (const r of rows) lines.push(`${r.no.toString().padStart(2," ")} | ${r.name} | ${r.iban} | ${r.amount}`);
    return lines.join("\n");
}

function download(filename, text){
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], {type:"text/plain;charset=utf-8"}));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function renderTable(rows){
    if (!rows || rows.length === 0) {
        output.innerHTML = "<p>No <code>CdtTrfTxInf</code> entries found.</p>";
        return;
    }
    let html = "<table><thead><tr><th>No.</th><th>Name</th><th>IBAN</th><th>Amount</th></tr></thead><tbody>";
    for (const r of rows) {
        html += `<tr><td>${r.no}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.iban)}</td><td>${escapeHtml(r.amount)}</td></tr>`;
    }
    html += "</tbody></table>";
    output.innerHTML = html;
}

function xpathNode(context, xpath) {
    const doc = (context && context.nodeType === Node.DOCUMENT_NODE) ? context : (context && context.ownerDocument) ? context.ownerDocument : document;
    const res = doc.evaluate(xpath, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return res ? res.singleNodeValue : null;
}

async function parseFile(file){
    if (!file) return;
    const text = await file.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");
    if (doc.getElementsByTagName("parsererror").length) {
        output.innerHTML = "<p>Error parsing XML</p>";
        downloadTxt.disabled = true;
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
