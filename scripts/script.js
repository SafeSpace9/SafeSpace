class MobileNavbar {
    constructor(mobileMenu, navList, navLinks) {
      this.mobileMenu = document.querySelector(mobileMenu);
      this.navList = document.querySelector(navList);
      this.navLinks = document.querySelectorAll(navLinks);
      this.activeClass = "active";
  
      this.handleClick = this.handleClick.bind(this);
    }
  
    animateLinks() {
      this.navLinks.forEach((link, index) => {
        link.style.animation
          ? (link.style.animation = "")
          : (link.style.animation = `navLinkFade 0.5s ease forwards ${
              index / 7 + 0.3
            }s`);
      });
    }
  
    handleClick() {
      this.navList.classList.toggle(this.activeClass);
      this.mobileMenu.classList.toggle(this.activeClass);
      this.animateLinks();
    }
  
    addClickEvent() {
      this.mobileMenu.addEventListener("click", this.handleClick);
    }
  
    init() {
      if (this.mobileMenu) {
        this.addClickEvent();
      }
      return this;
    }
  }
  
  const mobileNavbar = new MobileNavbar(
    ".mobile-menu",
    ".nav-list",
    ".nav-list li",
  );
  mobileNavbar.init();

  const modal = document.getElementById("myModal");
  const closeBtn = document.querySelector(".close");
  const openModalBtn = document.getElementById("openlogin");
  
  // Abre a modal
  openModalBtn.onclick = function(event) {
    event.preventDefault(); 
    openModal(); 
  }
  function openModal() {
    modal.style.display = "flex"; 
    document.body.style.overflow = "hidden"; 
  }
  closeBtn.onclick = function() {
    modal.style.display = "none";
    document.body.style.overflow = ""; 
  }
  window.onclick = function(event) {  
    if (event.target == modal) {
      modal.style.display = "none";
      document.body.style.overflow = ""; 
    }
  }
  document.getElementById("login-form").onsubmit = function(event) {
    event.preventDefault(); 
    console.log("Formulário enviado!");
  }
  document.getElementById("login-form").onsubmit = function(event) {
    event.preventDefault(); 
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    if (email === "admin1@gmail.com" && senha === "senha123") {
      alert("Login bem-sucedido!");
      window.location.href = "formulario.html";
      modal.style.display = "none";
      document.body.style.overflow = ""; 
    } else {
      alert("Usuário ou senha incorretos!");
    }
  }

  (function (w, d, s, o, f, js, fjs) {
    w["botsonic_widget"] = o;
    w[o] =
      w[o] ||
      function () {
        (w[o].q = w[o].q || []).push(arguments);
      };
    (js = d.createElement(s)), (fjs = d.getElementsByTagName(s)[0]);
    js.id = o;
    js.src = f;
    js.async = 1;
    fjs.parentNode.insertBefore(js, fjs);
  })(window, document, "script", "Botsonic", "https://widget.botsonic.com/CDN/botsonic.min.js");
  Botsonic("init", {
    serviceBaseUrl: "https://api-azure.botsonic.ai",
    token: "60f0098a-2901-4f95-8ce9-c06753437877",
  });
