const isTestUrl = ["http://192", "http://127", "localhost", "client88", "-test", "cp-sdk"].some((url) => origin.includes(url));
const isInternalUrl = ["client99", "-internal"].some((url) => origin.includes(url));
const envName = isTestUrl ? "test" : isInternalUrl ? "internal" : "prod";
let mainUrl = window.location.origin;
let params = window.location.href.split("?")[1];
const ENV = {
  test: {
    posthogUrl: 'https://posthog.client88.me',
    posthogToken: 'phc_lsTWT98yyPqH3CBKXFBZMu5mrUvhl493tpAx2QUPrZ3',
  },
  internal: {
    posthogUrl: 'https://posthog.client88.me',
    posthogToken: 'phc_lsTWT98yyPqH3CBKXFBZMu5mrUvhl493tpAx2QUPrZ3',
  },
  prod: {
    posthogUrl: 'https://posthog.client10.me',
    posthogToken: 'phc_flhwzzPKD5aBulVeeGXWS2SLsRayTQCN0Y8xhgYMJZ',
  },
}

// posthog
const envConfig = ENV[envName]
let link_with_id

const scripTag = document.createElement('script')
scripTag.type = 'text/javascript'
scripTag.async = true
scripTag.src = `${envConfig.posthogUrl}/static/array.js`
document.body.appendChild(scripTag)

scripTag.onload = () => {
  try {
    posthog.init(envConfig.posthogToken, { api_host: envConfig.posthogUrl })
    link_with_id = `${posthog.get_distinct_id()}`
    posthog.capture('$pageview');
  } catch (error) {
    console.error('PostHog initialization failed:', error);
  }
}
// end: posthog

if (window.location.pathname) {
  if (window.location.pathname.split("/")[2]) {
    let referrerId = window.location.pathname.split("/")[2];
    sessionStorage.setItem("partnerId", referrerId.toString());
  }
}

function getMobileOperatingSystem() {
  try {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    if (/windows phone/i.test(userAgent)) {
      return 'Windows Phone'
    }
    if (/android/i.test(userAgent)) {
      return 'Android'
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS'
    }

    return 'unknown'
  } catch (error) {
    console.log('faile check mdevide type', error)
  }
}

function redirect(path) {
  try {
    const isSignIn = path === 'signin';
    const posthogObj = {
      eventName: isSignIn ? 'FGC98-CLICK-SIGNIN' : 'FGC98-CLICK-SIGNUP',
      userGuid: link_with_id,
      phoneType: getMobileOperatingSystem()
    };
    posthog.capture('click_event', { property: posthogObj });
  } catch (error) {
    console.log('faile posthog', error)
  }

  const mainUrl = "https://www.casinoplus.com.ph/";
  const params = "partnerId=13606&mFbqId=377633928285434";
  const urlPath = `${mainUrl}/home/?${params}`;
  window.location.href = urlPath;
}

let docEl = document.documentElement;
let resize = "orientationchange" in window ? "orientationchange" : "resize";
let setRem = function () {
  let screenWidth = docEl.clientWidth || window.screen.width || 360;
  var referenceWidth = screenWidth <= 1024 ? 750 : 1920;
  docEl.style.fontSize = (100 * screenWidth) / referenceWidth + "px";
};
window.addEventListener("resize", setRem, false);
document.addEventListener("DOMContentLoaded", setRem, false);
setRem();