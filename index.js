let equations = document.querySelectorAll(".equation")

for (let i = 0; i < equations.length; i++) {
    equations[i].input = function(event) {
        alert(event.data)
        alert(event.data.length)
    }
}