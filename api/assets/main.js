function change(el, id) {
	const reader = new FileReader()
    reader.onload = function (e) {
    	$(`#${id}`).attr('src', e.target.result)
    }
    reader.readAsDataURL(el.files[0])
}


let intervalId = undefined
let topPosition=0
function startLoading() {
    $("div.loader").show()
    intervalId = setInterval(() => {
        topPosition = (topPosition == 0) ? 100 : 0
        $("div.loader").animate({top: `${topPosition}%`}, 900)
    }, 1000)
    
}

function stopLoading() {
    clearInterval(intervalId)
    $("div.loader").hide()
}

function callApi(data){
    $.ajax({
        url: '/generate',
        type: 'POST',
        data: data,
        dataType: 'json',
        processData: false,
  		contentType: false,
  		success: function(data, textStatus, jqXHR){
  		    $("#submit").hide()
            $("#back").show()
            $("div.img-block").hide()
            $("#result-img").attr("src", data.image)
            setTimeout(() => {
                stopLoading()
                $("#result-img").show()
            }, 500)
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('ERRORS: ' + errorThrown);
            stopLoading()
        }
    });
}

function generateArt(e) {
	e.preventDefault()
	let payload = new FormData()
	$("input[type=file]").each((i,el) => {
		$.each(el.files, (k,v) => payload.append(el.name,v))
	})
    startLoading()
    setTimeout(()=>{
        callApi(payload)
    }, 5000)
	return false
}

$("document").ready(() => {
	$("form").submit(generateArt)
    $("#back").hide()
    $("#result-img").hide()
    $("div.img-block").append("<div class='loader'></div>")

    const fileInputs = ["content_file", "style_file"]
    fileInputs.forEach(name => {
        $(`div.img-block[data-type=${name}]`).on("click", (e) => {
            e.stopPropagation()
            e.preventDefault()
            $(`input[type=file][name=${name}]`).click()
        })
        $(`input[type=file][name=${name}]`).on("click", (e) => {
            e.stopPropagation()
        })
    })
    $("#back").on("click", (e) => {
        e.stopPropagation()
        e.preventDefault()
        $("#submit").show()
        $("#back").hide()
        $("div.img-block").show()
        $("#result-img").hide()
    })
})
