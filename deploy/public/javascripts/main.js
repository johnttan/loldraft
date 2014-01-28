(function() {


}).call(this);

(function() {
  (function(window, document) {
    var layout, menu, menuLink, toggleClass;
    toggleClass = function(element, className) {
      var classes, i, length;
      classes = element.className.split(/\s+/);
      length = classes.length;
      i = 0;
      while (i < length) {
        if (classes[i] === className) {
          classes.splice(i, 1);
          break;
        }
        i++;
      }
      if (length === classes.length) {
        classes.push(className);
      }
      return element.className = classes.join(" ");
    };
    layout = document.getElementById("layout");
    menu = document.getElementById("menu");
    menuLink = document.getElementById("menuLink");
    return menuLink.onclick = function(e) {
      var active;
      active = "active";
      e.preventDefault();
      toggleClass(layout, active);
      toggleClass(menu, active);
      return toggleClass(menuLink, active);
    };
  })(this, this.document);

}).call(this);

(function() {


}).call(this);
