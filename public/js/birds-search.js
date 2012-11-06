var GAP_TO_KICK_SEARCH = 200;

function applyTickNow(){
        var now = new Date().getTime();
        $("#searchterm").attr('tickNow', now);
        setTimeout(checkTimer, GAP_TO_KICK_SEARCH);
}

function checkTimer() {
    var now = new Date().getTime();
    var prev = parseInt($("#searchterm").attr('tickNow'), 10);
    if ($("#searchterm").val().length > 2 && (now - prev) > GAP_TO_KICK_SEARCH) {
        invokeSearch();
    }
}

function invokeSearch() {
    var val = $("#searchterm").val().trim();
    $.getJSON("./search/" + val, function(res) {
        var $list = $("#results");
        $list.empty();
        $("#matched").text("Results found: " + res.response.numFound);
        var docs = res.response.docs;
        docs.forEach(function(item) {
            $list.append(getTemplate(item));
        });
    });
}

function getTemplate(item) {
    var str = "";
    with(item) {
        str = "<li><a class='main_href' href='" + link_t + "' target='_blank'>" + title_t + "</a> - <articale>" + summary_t + "</articale></li>";
    }
    return str;

}