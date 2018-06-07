import flexible from "../lib/flexible";

new flexible({isHD: true, pcREM: 46});

document.querySelectorAll('.title').forEach(function (item, index) {
    item.addEventListener("click", function (e) {
        if (this.nextElementSibling) {
            if (this.nextElementSibling.className === 'content') {
                this.nextElementSibling.className = 'content hidden';
            } else {
                this.nextElementSibling.className = 'content'
            }
        }
    })
})