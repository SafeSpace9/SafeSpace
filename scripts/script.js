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

  
