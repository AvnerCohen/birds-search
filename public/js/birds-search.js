var birdsSearch = {
    GAP_TO_KICK_SEARCH: 200,
    CURRENT_PAGE: 0
};

function changeSearchValue() {
    var now = new Date().getTime();
    $("#searchterm").attr('tickNow', now);
    setTimeout(checkTimer, birdsSearch.GAP_TO_KICK_SEARCH);
    birdsSearch.CURRENT_PAGE = 0 ; //Rest to first page
}

function checkTimer() {
    var now = new Date().getTime();
    var prev = parseInt($("#searchterm").attr('tickNow'), 10);
    if ($("#searchterm").val().length > 2 && (now - prev) > birdsSearch.GAP_TO_KICK_SEARCH) {
        invokeSearch();
    }
}

function invokeSearch() {
    var val = $("#searchterm").val().trim();
    var uri = "./search/" + val + "?page="+ birdsSearch.CURRENT_PAGE;
    $.getJSON(uri, function(res) {
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

function changeResultPage(){
    var next =($(this).attr('data-dir') === "next") ? true : false;

    if (next) birdsSearch.CURRENT_PAGE++;
    else if (!next && birdsSearch.CURRENT_PAGE>0) birdsSearch.CURRENT_PAGE--;
    invokeSearch();

}