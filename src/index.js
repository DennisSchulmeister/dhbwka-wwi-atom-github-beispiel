/*
 * Anleitung für die Coderverwaltung mit git, GitHub und Atom
 *
 * © 2018 Dennis Schulmeister-Zimolong <dhbw@windows3.de>
 * Lizenz: Creative Commons Namensnennung 4.0 International
 *
 * Sie dürfen:
 *
 *     Teilen — das Material in jedwedem Format oder Medium vervielfältigen
 *     und weiterverbreiten
 *
 *     Bearbeiten — das Material remixen, verändern und darauf aufbauen
 *     und zwar für beliebige Zwecke, sogar kommerziell.
 *
 * Unter folgenden Bedingungen:
 *
 *     Namensnennung — Sie müssen angemessene Urheber- und Rechteangaben
 *     machen, einen Link zur Lizenz beifügen und angeben, ob Änderungen
 *     vorgenommen wurden. Diese Angaben dürfen in jeder angemessenen Art
 *     und Weise gemacht werden, allerdings nicht so, dass der Eindruck
 *     entsteht, der Lizenzgeber unterstütze gerade Sie oder Ihre Nutzung
 *     besonders.
 *
 *     Keine weiteren Einschränkungen — Sie dürfen keine zusätzlichen Klauseln
 *     oder technische Verfahren einsetzen, die anderen rechtlich irgendetwas
 *     untersagen, was die Lizenz erlaubt.
 *
 * Es werden keine Garantien gegeben und auch keine Gewähr geleistet.
 * Die Lizenz verschafft Ihnen möglicherweise nicht alle Erlaubnisse,
 * die Sie für die jeweilige Nutzung brauchen. Es können beispielsweise
 * andere Rechte wie Persönlichkeits- und Datenschutzrechte zu beachten
 * sein, die Ihre Nutzung des Materials entsprechend beschränken.
 */
"use strict";

import MiniTutorial from "mini-tutorial.js";
import mtThemeWhite from "mini-tutorial.js/themes/white.css";
import mtThemeCommon from "mini-tutorial.js/themes/common.css";
import myStylesheet from "./style.css";

async function fetchChapters(chapters, callback) {
    let response = null;
    let html = "";

    for(let i = 0; i < chapters.length; i++) {
        response = await fetch(chapters[i]);
        html += await response.text();
    }

    if (document.readyState == "complete") {
        callback(html);
    } else {
        window.addEventListener("load", () => callback(html));
    }
}

function startApplication(html) {
    if (html) {
        let main = document.querySelector("main");
        main.innerHTML = html;
    }

    let mt = new MiniTutorial();
    mt.start();
}

fetchChapters([
    // Add HTML files here if you want to split the document.
    // The HTML files should only contain <section>-elements without <html>/<head>/<body>
    //
    // "01-intro.html",
    // "02-chapter2.html",
    // ...
], startApplication);
