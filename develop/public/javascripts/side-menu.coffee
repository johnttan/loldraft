((window, document) ->
  toggleClass = (element, className) ->
    classes = element.className.split(/\s+/)
    length = classes.length
    i = 0
    while i < length
      if classes[i] is className
        classes.splice i, 1
        break
      i++
    
    # The className is not found
    classes.push className  if length is classes.length
    element.className = classes.join(" ")
  layout = document.getElementById("layout")
  menu = document.getElementById("menu")
  menuLink = document.getElementById("menuLink")
  menuLink.onclick = (e) ->
    active = "active"
    e.preventDefault()
    toggleClass layout, active
    toggleClass menu, active
    toggleClass menuLink, active
) this, @document