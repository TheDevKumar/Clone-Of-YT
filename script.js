let form = document.querySelector("form");
let signup = document.querySelector(".signup");

let selectsign = document.querySelector("#selectt");
let uploadbtn = document.querySelectorAll(".upload-btn");
let uploadcontain = document.querySelector(".upload-contain");
let inputsupload = document.querySelectorAll(".uploadinp"); 
let uploadsumbit = document.querySelector("#upload-sumbit");
let signinp = document.querySelectorAll(".Sign-input");
let avataricon = document.querySelector(".nav-icon-btn");
let imgavatar = document.querySelector("#img-avatar");
let signinbtn = document.querySelector(".signin-btn"); 
let imgavatar2 = document.querySelector(".avatar-btn");
let videocontainer = document.querySelector(".video-container");
let videotext = document.querySelector(".video-active-title");
let vchname = document.querySelector(".vch-name");
let respsearch = document.querySelector("#resp-search")
let navleft = document.querySelector(".nav-left")
let cancelresp = document.querySelector("#cancelresp")
let Cancelicon = document.querySelector("#Cancel")
let fullscreenimg = document.querySelector("#fullscreenimg"); 

let videoGrid = document.querySelector(".video-grid");
let hamburger = document.querySelector(".hamburger");
let sidebar = document.querySelector(".sidebar");
let avatarofscreen = document.querySelector("#screen-avatar");
let desctext = document.querySelector(".desc-text");

let videosArray = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
let searchInput = document.querySelector("#searchInput");
let mainfooter = document.querySelector(".main-footer") 

let AccountInfo = JSON.parse(localStorage.getItem("Accounts")) || [];
let footerImgAvatar = document.querySelector("#footer-img-avatar");
let footerAvatarBtn = document.querySelector("#footer-avatar-btn");
let reloaderhome = document.querySelector(".location-reloader")
let logoyoutube = document.querySelector(".logo")

let startinganimation = document.querySelector(".starting-animation-yt")
let navbar = document.querySelector(".navbar")
let likes = document.querySelector("#likes")

let currentVideoId = null;

reloaderhome.addEventListener("click" , function(){
    location.reload();
})

logoyoutube.addEventListener("click" ,function(){
    location.reload();
})

respsearch.addEventListener("click" , function(){
    navleft.style.display = "none";
    cancelresp.style.display = "initial"
    searchInput.style.display = "initial"
    Cancelicon.style.display = "initial"
    searchInput.focus();
})

cancelresp.addEventListener("click" , function(){
    navleft.style.display = "initial";
    cancelresp.style.display = "none"
    searchInput.style.display = "none"
    Cancelicon.style.display = "none"
})


likes.addEventListener("click", function(){
    if (currentVideoId === null) return;

    videosArray = videosArray.map(video => {
        if (Number(video.id) === currentVideoId) {
            video.like = (video.like || 0) + 1;
            
            likes.innerHTML = `<i class="ti ti-thumb-up"></i> ${video.like}`;
        }
        return video;
    });

    localStorage.setItem("uploadedVideos", JSON.stringify(videosArray));
});


function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

const debouncedSearch = debounce(() => {
    let value = searchInput.value.toLowerCase();
    document.querySelectorAll(".vcard").forEach(card => {
        let title = card.querySelector(".vtitle").textContent.toLowerCase();
        card.style.display = title.includes(value) ? "block" : "none";
    });
}, 300);

searchInput.addEventListener("input", debouncedSearch);

window.addEventListener("DOMContentLoaded", () => {
    videosArray.forEach(videoData => {
        createCardDOM(videoData);
    });

    if (AccountInfo.length > 0) {
        let currentAccount = AccountInfo[AccountInfo.length - 1]; 
        applyLoginState(currentAccount);
    }

    setTimeout(() => {
        startinganimation.style.display = "none";
        navbar.style.display = "flex";
        mainfooter.style.display = "flex";
        document.querySelectorAll(".vcard").forEach(card => {
            card.style.display = "initial"
            });
        
    }, 2500);
});

hamburger.addEventListener("click", function() {
    sidebar.classList.toggle("sidebar-hidden");
});

signinbtn.addEventListener("click" , function(){
    signup.style.display = "flex";
});

function getEmbedUrl(url) {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
        return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
        let id = url.split("/").pop();
        return `https://www.youtube.com/embed/${id}`;
    }
    return url; 
}

videoGrid.addEventListener("click", function(event) {
    let card = event.target.closest(".vcard");
    if (!card) return;

    fullscreenimg.focus();
    videocontainer.style.display = "flex";
    
    let cardId = Number(card.dataset.id); 
    currentVideoId = cardId; 

    let activeVideoData = null;

    videosArray = videosArray.map(video => {
        if (Number(video.id) === cardId) {
            video.views = (video.views || 0) + 1; 
            activeVideoData = video; 

            let viewSpan = card.querySelector(".view-count");
            if(viewSpan) viewSpan.textContent = video.views;
             document.querySelector(".desc-meta").innerHTML = `${video.views} Views &middot; 1 min ago ` 
        }
        return video;
    });

    localStorage.setItem("uploadedVideos", JSON.stringify(videosArray));

    let vidtext = card.querySelector(".vtitle").textContent;
    let chnlname = card.querySelector(".vch-name").textContent;
    
    videotext.textContent = vidtext;
    vchname.innerHTML = `${chnlname} <i class="ti ti-circle-check-filled"></i>`;
    desctext.textContent = card.dataset.description || "No description available.";
    
    if (activeVideoData) {
        let totalLikes = activeVideoData.like || 0;
        likes.innerHTML = `<i class="ti ti-thumb-up"></i> ${totalLikes}`;
    } else {
        likes.innerHTML = `<i class="ti ti-thumb-up"></i> 0`;
    }

    let rawVideoUrl = card.dataset.videoUrl;
    if (rawVideoUrl) {
        fullscreenimg.src = getEmbedUrl(rawVideoUrl);
    } else {
        fullscreenimg.src = "https://www.youtube.com/embed/dQw4w9WgXcQ"; 
    }

    let avatarrrr = card.querySelector(".ch-avatar");
    if (avatarrrr) {
        let thumbava = avatarrrr.style.backgroundImage;
        if(thumbava) {
            let cleanavatar = thumbava.slice(4, -1).replace(/[\"\\]/g, "");
            avatarofscreen.style.backgroundImage = `url("${cleanavatar}")`;
        }
    }
});




uploadbtn.forEach(uploadorg => {
    uploadorg.addEventListener("click" , function(){
        uploadcontain.style.display = "flex";
    });
});

uploadsumbit.addEventListener("click" , function(){
    let currentAccount = { idname: "Anonymous", pfps: "" }; 
    if (AccountInfo.length > 0) {
        currentAccount = AccountInfo[AccountInfo.length - 1]; 
    }

    const videoData = {
        id: Date.now(), 
        thumbnail: inputsupload[0].value || "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200", 
        title: inputsupload[1].value || "Untitled Video",
        description: inputsupload[2].value || "No description provided.", 
        videoUrl: inputsupload[3] ? inputsupload[3].value : "", 
        channelName: currentAccount.idname,
        channelAvatar: currentAccount.pfps,
        views: 0 ,
        like: 0
    };

    createCardDOM(videoData);

    videosArray.push(videoData);
    localStorage.setItem("uploadedVideos", JSON.stringify(videosArray));

    uploadcontain.style.display = "none";
    inputsupload[0].value = "";
    inputsupload[1].value = "";
    inputsupload[2].value = "";
    if(inputsupload[3]) inputsupload[3].value = "";
});

function createCardDOM(data) {
    const vcard = document.createElement('div');
    vcard.className = 'vcard';
    vcard.setAttribute('role', 'article');
    
    vcard.dataset.id = data.id; 
    vcard.dataset.description = data.description;
    vcard.dataset.videoUrl = data.videoUrl;

    const thumb = document.createElement('div');
    thumb.className = 'thumb';

    const thumbBg = document.createElement('div');
    thumbBg.className = 'thumb-bg';
    thumbBg.style.backgroundImage = `url(${data.thumbnail})`;

    const playOverlay = document.createElement('div');
    playOverlay.className = 'play-overlay';
    const playIcon = document.createElement('i');
    playIcon.className = 'ti ti-player-play-filled';
    playOverlay.appendChild(playIcon);

    const durationBadge = document.createElement('span');
    durationBadge.className = 'duration-badge';
    durationBadge.textContent = '15:42';

    thumb.appendChild(thumbBg);
    thumb.appendChild(playOverlay);
    thumb.appendChild(durationBadge);

    const vcardBody = document.createElement('div');
    vcardBody.className = 'vcard-body';

    const chAvatar = document.createElement('div');
    chAvatar.className = 'ch-avatar';
    chAvatar.style.backgroundImage = `url(${data.channelAvatar})`;

    const vcardInfo = document.createElement('div');
    vcardInfo.className = 'vcard-info';

    const vtitle = document.createElement('p');
    vtitle.className = 'vtitle';
    vtitle.textContent = data.title;

    const vchName = document.createElement('p');
    vchName.className = 'vch-name';
    vchName.textContent = data.channelName;

    const vmeta = document.createElement('p');
    vmeta.className = 'vmeta';
    vmeta.innerHTML = `<span class="view-count">${data.views || 0}</span> views &middot; Just now`;
    
    const vsubs = document.createElement('p');
    vsubs.className = 'vsubs';
    vsubs.textContent = '1.2M subscribers';

    vcardInfo.appendChild(vtitle);
    vcardInfo.appendChild(vchName);
    vcardInfo.appendChild(vmeta);
    vcardInfo.appendChild(vsubs);

    vcardBody.appendChild(chAvatar);
    vcardBody.appendChild(vcardInfo);

    vcard.appendChild(thumb);
    vcard.appendChild(vcardBody);

    videoGrid.appendChild(vcard);
}

form.addEventListener("submit" , function(evt){
    evt.preventDefault();

    const Accounts = {
        idname : signinp[0].value || "User",
        pfps : signinp[2].value || "https://via.placeholder.com/150",
        role: selectsign.value
    };

    AccountInfo.push(Accounts);
    localStorage.setItem("Accounts" , JSON.stringify(AccountInfo));
    
    applyLoginState(Accounts);

    signinp[0].value = "";
    if(signinp[1]) signinp[1].value = "";
    signinp[2].value = "";
}); 

function applyLoginState(acc) {
    if (!acc) return;

    if (acc.pfps) {
        imgavatar.src = acc.pfps;
        if (footerImgAvatar && footerAvatarBtn) {
            footerImgAvatar.src = acc.pfps;
            footerAvatarBtn.classList.add("has-image"); 
        }
    } else {
        if (footerAvatarBtn) {
            footerAvatarBtn.classList.remove("has-image");
        }
    }

    signup.style.display = "none";
    signinbtn.style.display = "none";
    
    if (avataricon) avataricon.style.display = "initial";
    if (imgavatar2) imgavatar2.style.display = "initial";

    if (acc.role === "Viewer") {
        uploadbtn.forEach(btn => btn.style.display = "none");
    } else if (acc.role === "Creator") {
        uploadbtn.forEach(btn => btn.style.display = "flex");
    }
}
