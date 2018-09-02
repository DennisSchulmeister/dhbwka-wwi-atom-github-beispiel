/*
 * Beispiel für die Coderverwaltung mit git, Github und Atom
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

/**
 * Diese Klasse steuert unsere kleine Webanwendung.
 */
class MiniTutorial {
    /**
     * Yeah! Der Konstruktor.
     */
    constructor() {
        this.sections = document.querySelectorAll("section");
        this.nav = document.querySelector("nav");
        this.index = 0;
        this.titlePrefix = document.title;

        window.addEventListener("click", event => this._onLinkClicked(event));
        window.addEventListener("popstate", event => this._onHistoryChanged(event));
        window.addEventListener("keyup", event => this._handleKeyUpEvent(event));
    }

    /**
     * Alle <section> bis auf das Inhaltsverzeichnis unsichtbar machen.
     * Hierfür wird ihnen einfach die CSS-Klasse "hidden" hinzugefügt.
     */
    hideAllSections() {
        this.sections.forEach(section => {
            if (section.id === "toc") return;
            section.classList.add("hidden");
        });
    }

    /**
     * Alle <section> ausblenden und stattdessen die <section> mit dem
     * übergebenen Index anzeigen. Der Index beginnt dabei bei 1, da
     * Index 0 das Inhaltsverzeichnis ist, das ja ohnehin immer angezeigt
     * wird.
     *
     * @param {int} index Anzuzeigende <section> beginnend bei 1
     */
    showSection(index) {
        // Indexwert prüfen
        if (index < 1 || index >= this.sections.length) index = 1;

        // Eintrag in den Browserverlauf schreiben
        this._pushNavigationHistory(index, this.index);
        this.index = index;

        // <section> anzeigen
        this.hideAllSections();
        let section = this.sections[index];

        if (section === undefined) return;
        section.classList.remove("hidden");

        // Scrollbalken nach oben setzen
        window.scrollTo(0, 0);

        // Fenstertitel aktualisieren
        if (section.dataset.title) {
            document.title = `${this.titlePrefix} – ${section.dataset.title}`;
        } else {
            document.title = this.titlePrefix;
        }

        // Aktuellen Eintrag im Inhaltsverzeichnis aktualisieren
        let currentIndex = 0;

        document.querySelectorAll("#toc li a").forEach(tocItem => {
            currentIndex++;

            if (currentIndex === index) {
                tocItem.classList.add("active");
            } else {
                tocItem.classList.remove("active");
            }
        });

        // Nav-Links aktualisieren
        this.nav.innerHTML = "";
        let link_prev = document.createElement("a");
        let link_next = document.createElement("a");

        this.nav.appendChild(link_prev);
        this.nav.appendChild(link_next);

        if (index > 1) {
            let sectionPrev = this.sections[index - 1];

            if (sectionPrev.dataset.title) {
                link_prev.textContent = sectionPrev.dataset.title;
                link_prev.href = "#" + (index - 1);
            }
        }

        if (index < this.sections.length - 1) {
            let sectionNext = this.sections[index + 1];

            if (sectionNext.dataset.title) {
                link_next.textContent = sectionNext.dataset.title;
                link_next.href = "#" + (index + 1);
            }
        }
    }

    /**
     * <h2>-Überschrift in jede <section> einfügen. Die Überschrift wird
     * dabei aus dem data-title-Attribut der <section> genommen. Das
     * Inhaltsverzeichnis bekommt eine <h3>-Überschrift.
     */
    insertHeadings() {
        this.sections.forEach(section => {
            let title = section.dataset.title;
            if (title === undefined) return;

            let headingType = "h2";

            if (section.id === "toc") headingType = "h3";

            let heading = document.createElement(headingType);
            heading.textContent = title;
            section.insertBefore(heading, section.childNodes[0]);
        });
    }

    /**
     * Inhaltsverzeichnis aufbauen.
     */
    buildTOC() {
        let list = document.createElement("ol");
        let index = -1;

        this.sections.forEach(section => {
            index++;

            if (section.id === "toc") {
                section.appendChild(list);
                return;
            }

            let title = section.dataset.title;
            if (title === undefined) return;

            let link = document.createElement("a");
            link.textContent = title;
            link.href = "#" + index;

            let listItem = document.createElement("li");
            listItem.appendChild(link);
            list.appendChild(listItem);
        });
    }

    /**
     * Event Handler für angeklickte <a>-Elemente. Hier wird bei Klick auf
     * einen Link die sichtbare <section> gewechselt, wenn der Link aus
     * einer Raute und dem Index besteht. Zum Beispiel: #1 oder #42. Alle
     * anderen Links werden ignoriert und vom Browser ganz normal ausgeführt.
     *
     * @param {DOMEvent} event Das abgefangene Klick-Event
     */
    _onLinkClicked(event) {
        let target = event.target;
        while (target && target.nodeName != "A") target = target.parentNode;
        if (!target || target.nodeName != "A") return;

        let href = target.getAttribute("href");
        if (href === null || !href.startsWith("#")) return;

        let index = target.hash.slice(1);
        if (!index.length) return;

        index = parseInt(index);
        if (index === NaN) return;

        event.preventDefault();
        this.showSection(index);
    }

    /**
     * Navigation bei Klick auf den Zurück-Button des Browsers ausführen.
     * Das funktioniert, weil bei der Anzeige einer <section> die Methode
     * this._pushNavigationHistory() aufgerufen wird, um einen Eintrag
     * in den Browserverlauf zu schreiben.
     *
     * @param {DOMEvent} event Das abgefangene PopState Event
     */
    _onHistoryChanged(event) {
        let index = 1;

        if (event.state) {
            let state = JSON.parse(event.state)
            index = state.index;
        } else {
            index = location.hash.slice(1);
        }

        index = parseInt(index);
        if (isNaN(index)) return;

        this._lockHistory = true;
        this.showSection(index);
        this._lockHistory = false;
    }

    /**
     * Bei Aufruf einer neuen <section> einen neuen Eintrag in die
     * Navigationshistorie des Browsers schreiben.
     *
     * @param  {Integer} newIndex Index der neuen <section> beginnend bei 1
     * @param  {Integer} oldIndex Vorheriger Index oder 0
     */
    _pushNavigationHistory(newIndex, oldIndex) {
        if (this._lockHistory) return;

        let state = {
            index: newIndex,
        };

        let url = `#${newIndex}`;

        if (oldIndex == 0) {
            history.replaceState(JSON.stringify(state), "", url);
        } else {
            history.pushState(JSON.stringify(state), "", url);
        }
    }

    /**
     * Umschalten der sichtbaren <section> mit Pfeil Links und Pfeil Rechts.
     * @param {DOMEvent} event Das abgefangene KeyUp Event
     */
    _handleKeyUpEvent(event) {
        if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) return;

        switch (event.code) {
            case "ArrowLeft":
                // Vorheriges Kapitel
                if (this.index > 1) {
                    this.showSection(this.index - 1);
                }
                break;
            case "ArrowRight":
            case "Enter":
            case "Space":
            case "KeyN":
                // Nächstes Kapitel
                if (this.index < this.sections.length - 1) {
                    this.showSection(this.index + 1);
                }
                break;
        }
    }
}

/**
 * Anwendung starten, sobald das DOM bereit ist.
 */
window.addEventListener("load", () => {
    let mt = new MiniTutorial();
    mt.hideAllSections();
    mt.insertHeadings();
    mt.buildTOC();

    let index = location.hash.slice(1);
    index = parseInt(index);

    if (isNaN(index)) index = 1;
    mt.showSection(index);
});
