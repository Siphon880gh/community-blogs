/**
 * Grows textarea as you type pass the textarea height 
 */
function autoresizeTextarea() {
    let ta = document.querySelector("textarea");
    ta.addEventListener("keyup", () => {
        let ta = document.querySelector("textarea");
        ta.style.overflow = "hidden";
        ta.style.height = "auto";
        ta.style.height = Math.max(ta.scrollHeight, 60) + "px";
    });
}