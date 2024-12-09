var document = document.documentElement || document.body
document.addEventListener("DOMContentLoaded", function(){
  decryptImgPareZh()
  pareSrcImg()
  pareUrlImg()
})
var imgeStore = {}
function pareUrlImg () {
  var result = document.querySelectorAll('[data-pare-url="true"]')
  for (var i = 0; i < result.length; i++) {
    var dom = result[i]
    var res = window.getComputedStyle(dom)
    var url = res.backgroundImage.replace(/url\("|"\)/g, '')
    if (imgeStore[url]) {
      dom.style.backgroundImage = imgeStore[url]
      continue
    }
    function getImg (url, dom) {
      myAjax({
        url: url,
        success: function (response) {
          var arrayBuf = response
          var buf = new ArrayBuffer(arrayBuf.byteLength)
          var v1 = new Uint8Array(buf)
          var v2 = new Uint8Array(arrayBuf)
          for (var i = 0; i < arrayBuf.byteLength; i++) {
            v1[i] = v2[arrayBuf.byteLength - 1 - i]
          }
          var blobFile = new Blob([buf])
          
          var backgroundUrl = window.URL.createObjectURL(blobFile)
          imgeStore[url] = backgroundUrl
          dom.style.backgroundImage = 'url("' + backgroundUrl + '")'
        },
      })
    }
    getImg(url, dom)
  }
}
function decryptImgPareZh () {
  var result = document.querySelectorAll('parse-zhong-wen')
  for (var i = 0; i < result.length; i++) {
    var buf = string2Buffer(result[i].innerHTML);
    for (var j = 0; j < buf.length; j++) buf[j] -= 1;
    result[i].innerHTML = buffer2String(buf)
  }
  var title = document.title
  if (/\<parse-zhong-wen\>/.test(title)) {
    title = title.replace(/\<parse-zhong-wen\>/g, '')
    title = title.replace(/\<\/parse-zhong-wen\>/g, '')
    title = title.replace(/[\u4E00-\u9FA5]+/g, function (match) {
      var titleBuf = string2Buffer(match)
      for (var j = 0; j < titleBuf.length; j++) titleBuf[j] -= 1
      return buffer2String(titleBuf)
    })
    console.log('title3', title)
  }
  document.title = title
}
function pareSrcImg () {
  var image = document.querySelectorAll('[decoding-img-src]')
  for (var i = 0; i < image.length; i++) {
    var src = image[i].getAttribute('decoding-img-src')
    if (imgeStore[src]) {
      image[i].src = imgeStore[src]
      continue
    }
    decodingImg(image[i], src)
  }
}
function decodingImg (img, src) {
  myAjax({
    url: src,
    success: function (res) {
      var arrayBuf = res
      var buf = new ArrayBuffer(arrayBuf.byteLength)
      var v1 = new Uint8Array(buf)
      var v2 = new Uint8Array(arrayBuf)
      for (var i = 0; i < arrayBuf.byteLength; i++) {
        v1[i] = v2[arrayBuf.byteLength - 1 - i]
      }
      var blobFile = new Blob([buf])
      let srcFile = window.URL.createObjectURL(blobFile);
      img.src = srcFile
      imgeStore[src] = srcFile
    }
  })
}
function buffer2String (buf) {
  var str = '';
  for (var i = 0; i < buf.length; i++) {
    str += String.fromCharCode(buf[i])
  }
  return str
}
function string2Buffer (str) {
  var ret = []
  for (var i = 0; i < str.length; i++) {
    ret.push(str.charCodeAt(i))
  }
  return ret
}
function updateDecryptImg() {
  pareSrcImg()
  pareUrlImg()
}
function myAjax ({ url: url, success: success }) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url,true);
  xmlhttp.responseType = "arraybuffer";
  xmlhttp.onload = function(){
    if (this.status === 200) {
      success(this.response)
    }
  }
  xmlhttp.send();
}