const api_domain = "https://scrapetacular.herokuapp.com"

var headings = [];
var breadcrumb_path = [];

function get_values(query) {
    return $(query).map(function (idx, elem) {
        return $(elem).val();
    }).get();
}

function insert_text(query, string_list) {     
    $(query).each(function (idx, elem) {
        $(elem).text(string_list[idx]);
    });
}

function input_success(elem) {
    if (elem.val().trim().length > 0) {
        elem.addClass("is-success");
    } else {
        elem.removeClass("is-success");
    }
}

function keyup_input_success(event) {
    input_success($(event.currentTarget));
}

function initial_input_success() {
    input_success($(this));
}

function insert_attrs_to(query, attr_value, limit) {      
    $(query).each(function (idx, elem) {
        if (idx < limit) {
            $(elem).attr("name", attr_value);
        } else {
            $(elem).removeAttr("name");
        }
    });
}

function set_headings() {
    const raw_headings = get_values(".headings-input-section input");
    const trimmed_headings = raw_headings.map(function(heading) {
        return heading.trim();
    });
    headings = trimmed_headings.filter(function(heading) {
        return heading.length != 0;
    });
    console.log(headings);
}

function show_elements_to(query, limit) {
    $(query).each(function (idx, elem) {
        if (idx >= limit) {
            $(elem).hide();
        } else {
            $(elem).show();
        }
    });
}

function submitFormTo(query, on_success, on_error) {
    var body = $(query).serializeJSON();
    console.log(body);
    $('div.from').text(JSON.stringify(body));

    const myInit = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'omit',
        mode: 'cors',
        cache: 'default'
    };
    fetch(api_domain + '/', myInit)
        .then(response => response.json())
        .then(data => on_success(data))
        .catch((error) => {
            console.log("error");
            console.log(error);
            on_error(error);
        });
//    on_success([["five", "six", "seven", "eight"]])
}


function submitFormTo2(query, on_success, on_error) {
    var body = $(query).serializeJSON();
    console.log(body);
    $('div.from').text(JSON.stringify(body));

    const api_domain1 = "https://scrapetacular.herokuapp.com"

    const myInit = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'omit',
        mode: 'cors',
        cache: 'default'
    };
    fetch(api_domain1 + '/', myInit)
        .then(response => response.blob())
        .then(data => on_success(data))
        .catch((error) => {
            console.log("error");
            console.log(error);
            alert("Probably no pattern found or server error, go back and try again")
            on_error(error);
        });
}

function submitPrefetchURL(url, on_success, on_error) {
    var body = {
    	url: url
    }
    console.log(body);
    $('div.from').text(JSON.stringify(body));

    const myInit = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'omit',
        mode: 'cors',
        cache: 'default'
    };
    fetch(api_domain + '/prefetch_url', myInit)
        .then(response => response.json())
        .then(data => on_success(data))
        .catch((error) => {
            console.log("error");
            console.log(error);
            on_error(error);
        });
//    on_success([["five", "six", "seven", "eight"]])
}


function add_value_to_input(query, values, limit) {
    $(query).each(function (idx, elem) {
        if (idx < limit) {
            $(elem).val(values[idx]);
        }
    });
}

function build_table_structure(table_headings, table_rows) {
    var table_structure = [];
    console.log(table_headings);
    console.log(table_rows);

    for (let table_row of table_rows) {
        var entry = {};
        for (const [index, cell] of table_row.entries()) {
            entry[table_headings[index]] = cell;
        }
        table_structure.push(entry);
    }
    return table_structure;
}

function build_and_append_table(query, data) {
    $(query).append(build_table(data));
    $(query).find("tbody th").addClass("has-text-grey is-unselectable");
    $(query).find("table").addClass("table is-narrow is-hoverable is-fullwidth");
}

function build_table(data) {
    if (data.length == 0) {
        return null;
    }
    var table = $("<table>");
    append_header(table, data[0]);
    append_rows(table, data);
    return table;
}

function append_header(table, first_row) {
    var thead = $("<thead>");
    var tr = $("<tr>");
    for (let key in first_row) {
        tr.append($(`<th>${key}</th>`));
    }
    thead.append(tr);
    table.append(thead);
}

function append_rows(table, data) {
    var tbody = $("<tbody>");
    for (let row_data of data) {
        tbody.append(build_table_row(row_data));
    }
    table.append(tbody);
}

function build_table_row(row_data) {
    var tr = $("<tr>");
    for (let key in row_data) {
        tr.append($(`<th>${row_data[key]}</th>`));
    }
    return tr
}

function submitAutocomplete(term, callback) {
    console.log(term);
    const raw_url = get_values(".url-input-section input")[0];
    const body = {
        url: raw_url,
        term: term,
    }
    const myInit = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'omit',
        mode: 'cors',
        cache: 'default'
    };
    fetch(api_domain + '/autocomplete', myInit)
        .then(response => response.json())
        .then(data => callback(data))
        .catch((error) => {
            callback([]);
        });
}

var first_url_autocomplete_data = [{
    match: /^(\s*)(\S[\S\s]*)$/,
    search: submitAutocomplete,
    replace: function (value) {
        return value;
    },
    template: function (value) {
        if (value.length < 100) {
            return value;
        }
        return value.slice(0, 45).concat("  ....  ").concat(value.slice(value.length - 45, value.length));
    }
}];


function last_from(choices, path) {
    for (let item of path.slice().reverse()) {
        if (choices.includes(item)) {
            return item;
        }
    }
}







function handle_first_row_next_success(predicted_second_row) {
    if (predicted_second_row) {
        const raw_first_row_data = get_values(".first_row-input-section textarea").slice(0, headings.length);
        add_value_to_input(".second_row-input-section textarea", predicted_second_row, headings.length);
        insert_attrs_to(".second_row-input-section textarea", "second_queries[]", headings.length);
        $(".first_row-input-section").fadeOut("fast", function() {
            show_elements_to(".first_row-completed-section .column", headings.length);
            insert_text(".first_row-completed-section .subtitle", headings);
            insert_text(".first_row-completed-section code", raw_first_row_data);
            $(".first_row-completed-section").fadeIn(200, function () {
                var preview_rows = [raw_first_row_data, predicted_second_row];
                var table_structure = build_table_structure(headings, preview_rows);
                $(".double_row-preview-section .data_preview-table-container table").remove();
                build_and_append_table(".double_row-preview-section .data_preview-table-container", table_structure);

                breadcrumb_path.push(".first_row-input-section");
//                insert_text(".first_row-preview-section thead th", headings);
                $(".double_row-preview-section").fadeIn(200);
            });
        });
    } else {
        alert("no pattern found automatically")
        const raw_first_row_data = get_values(".first_row-input-section textarea").slice(0, headings.length);
        $(".first_row-input-section").fadeOut("fast", function() {
            show_elements_to(".first_row-completed-section .column", headings.length);
            insert_text(".first_row-completed-section .subtitle", headings);
            insert_text(".first_row-completed-section code", raw_first_row_data);
            $(".first_row-completed-section").fadeIn(200, function () {
                breadcrumb_path.push(".first_row-input-section");
                show_elements_to(".second_row-input-section .column", headings.length);
                insert_text(".second_row-input-section .label", headings);
                insert_attrs_to(".second_row-input-section textarea", "second_queries[]", headings.length);
//                insert_text(".first_row-preview-section thead th", headings);
                $(".second_row-input-section").fadeIn(200);
            });
        });
    }
}


function handle_second_row_next_success(preview_data) {
    const raw_second_row_data = get_values(".second_row-input-section textarea");
    $(".second_row-input-section").fadeOut("fast", function() {
        show_elements_to(".second_row-completed-section .column", headings.length);
        insert_text(".second_row-completed-section .subtitle", headings);
        insert_text(".second_row-completed-section code", raw_second_row_data);
        $(".second_row-completed-section").fadeIn(200, function () {
            $(".second_row-preview-section .data_preview-table-container table").remove();
            $(".third_row-input-section .data_preview-table-container table").remove();
            var table_structure = build_table_structure(headings, preview_data);
            build_and_append_table(".second_row-preview-section .data_preview-table-container", table_structure);
            build_and_append_table(".third_row-input-section .data_preview-table-container", table_structure);
            breadcrumb_path.push(".second_row-input-section");
            $(".second_row-next-button").removeClass("is-loading");
            $(".second_row-preview-section").fadeIn(200);
        });
    });      
}


function handle_third_row_next_success(preview_data) {
    console.log(preview_data);
    const raw_third_row_data = get_values(".third_row-input-section textarea");
    $(".third_row-input-section").fadeOut("fast", function() {
        show_elements_to(".third_row-completed-section .column", headings.length);
        insert_text(".third_row-completed-section .subtitle", headings);
        insert_text(".third_row-completed-section code", raw_third_row_data);
        $(".third_row-completed-section").fadeIn(200, function () {
            breadcrumb_path.push(".third_row-input-section");
            $(".third_row-preview-section .data_preview-table-container table").remove();
            var table_structure = build_table_structure(headings, preview_data);
            build_and_append_table(".third_row-preview-section .data_preview-table-container", table_structure);
            $(".third_row-next-button").removeClass("is-loading");
            $(".third_row-preview-section").fadeIn(200);
        });
    });
}


function handle_double_row_looks_good(preview_data) {
    $(".double_row-preview-section").fadeOut(200, function () {
        $(".second_row-preview-section .data_preview-table-container table").remove();
        $(".third_row-input-section .data_preview-table-container table").remove();
        var table_structure = build_table_structure(headings, preview_data);
        build_and_append_table(".second_row-preview-section .data_preview-table-container", table_structure);
        build_and_append_table(".third_row-input-section .data_preview-table-container", table_structure);
        breadcrumb_path.push(".double_row-preview-section");
        $(".double_row-looks_good-button").removeClass("is-loading");
        $(".second_row-preview-section").fadeIn(200);
    });
}


function handle_second_page_looks_good(blob) {
    let link = document.createElement('a');
    link.download = 'jello.csv';

    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);

    link.click();
    
	setTimeout(function(){
	  document.body.removeChild(link);
	  URL.revokeObjectURL(link.href);
	}, 100); 


    // URL.revokeObjectURL(link.href);
    
    $(".url_list-next-button").removeClass("is-loading");
    $(".third_row-looks_good-button").removeClass("is-loading");
    $(".second_row-looks_good-button").removeClass("is-loading");
}


$(window).on('load', function () {
	const cors_get_request = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        mode: 'cors',
        cache: 'default'
    };

   	fetch(api_domain + "/alive", cors_get_request)
   	.then((response) => {
   		console.log("API working: " + api_domain);
   		return response;
   	})
   	.catch((error) => {
   		console.log("API failing: " + api_domain);
   		alert("Scraping server down, please email if you need access")
   	})
   	
    $(".first_row-input-section textarea").textcomplete(first_url_autocomplete_data);
    $(".second_row-input-section textarea").textcomplete(first_url_autocomplete_data);
    $(".third_row-input-section textarea").textcomplete(first_url_autocomplete_data);

   	
    $(".url-input-section input")[0].focus();
    
    $(".url-next-button").click(function () {
        const raw_url = get_values(".url-input-section input");
        console.log(raw_url);
        $(".big_title_header .subtitle").slideUp(200);
        $(".big_title_header .title").slideUp(200);
        $(".url-input-section").fadeOut("fast", function() {
            insert_text(".url-completed-section .subtitle", raw_url);
            $(".url-completed-section").fadeIn(300, function() {
                $(".headings-input-section").fadeIn(1000);
                $(".headings-input-section input")[0].focus()
                submitAutocomplete("blank", console.log)
            });
        });
    });
    
    
    $(".url-input-section input").keyup(function(event) {
        if (event.keyCode === 13) {
            $(".url-next-button").click();
        }
    });

    $('.headings-input-section input').keyup(keyup_input_success);
    $('.headings-input-section input').each(initial_input_success);
    
    
    $(".headings-back-button").click(function () {
        $(".headings-input-section").fadeOut("fast", function() {
            $(".url-completed-section").fadeOut(200, function () {
                insert_attrs_to(".first_row-input-section textarea", "disabled[]", 4);
                insert_attrs_to(".headings-input-section input", "disabled[]", 4);
                $(".url-input-section").fadeIn(200);
                $(".url-input-section input")[0].focus()
            });
        });
    });
    
    
    $(".headings-next-button").click(function () {
        set_headings();
        if (headings.length != 0) {
            $(".headings-input-section").fadeOut("fast", function() {
                insert_attrs_to(".headings-input-section input", "headings[]", headings.length);
                show_elements_to(".headings-completed-section .column", headings.length);
                insert_text(".headings-completed-section .subtitle", headings);
                $(".headings-completed-section").fadeIn(200, function () {
                    show_elements_to(".first_row-input-section .column", headings.length);
                    insert_text(".first_row-input-section .label", headings);
                    insert_attrs_to(".first_row-input-section textarea", "first_queries[]", headings.length);
                    $(".first_row-input-section").fadeIn(200);
                    $(".first_row-input-section textarea")[0].focus()
                });
            });
        }
    });
    
    
    $(".first_row-next-button").click(function () {
        const raw_first_row_data = get_values(".first_row-input-section textarea");
        $(".first_row-next-button").addClass("is-loading");
        submitFormTo(".main_form", handle_first_row_next_success, alert);
    });

    
    $(".first_row-back-button").click(function () {
        $(".first_row-input-section textarea").attr("name", "disabled[]");
        $(".first_row-input-section").fadeOut("fast", function() {
            $(".headings-completed-section").fadeOut(200, function () {
                $(".headings-input-section").fadeIn(200);
                $(".headings-input-section input")[0].focus()
                $(".first_row-next-button").removeClass("is-loading");
            });
        });
    });
    
    $(".first_row-looks_good-button").click(function () {
    	// FIXME download CS here?
    	$(".empty_url_list").attr("name", "url_list");
    	
        $(".first_row-looks_good-button").addClass("is-loading");
        submitFormTo2(".main_form", handle_second_page_looks_good, alert);
        // alert(JSON.stringify($(".main_form").serializeJSON()));
    });
    
    $(".first_row-missing_data-button").click(function () {
        $(".first_row-preview-section").fadeOut(200, function () {
            show_elements_to(".second_row-input-section .column", headings.length);
            insert_text(".second_row-input-section .columns .label", headings);
            $(".second_row-input-section").fadeIn(200);
            $(".second_row-input-section textarea")[0].focus();
        });
    });
    
    $(".first_row-preview-back-button").click(function () {	
        $(".empty_url_list").attr("name", "disabled[]");
        $(".first_row-preview-section").fadeOut("fast", function() {
            $(".first_row-completed-section").fadeOut(200, function () {
                $(".first_row-input-section").fadeIn(200);
                $(".first_row-input-section textarea")[0].focus()
                $(".first_row-next-button").removeClass("is-loading");
            });
        });
    });
    
    
    $(".double_row-missing_data-button").click(function () {
        $(".double_row-preview-section").fadeOut(200, function () {
            show_elements_to(".second_row-input-section .column", headings.length);
            insert_text(".second_row-input-section .label", headings);
            insert_attrs_to(".second_row-input-section textarea", "second_queries[]", headings.length);
            breadcrumb_path.push(".double_row-preview-section");
            $(".second_row-input-section").fadeIn(200);
            $(".second_row-input-section textarea")[0].focus()
        });
    });
    
    $(".double_row-preview-back-button").click(function () {
        $(".double_row-preview-section").fadeOut("fast", function() {
            $(".first_row-completed-section").fadeOut(200, function () {
                insert_attrs_to(".second_row-input-section textarea", "disabled[]", headings.length);
                $(".first_row-input-section").fadeIn(200);
                $(".first_row-input-section textarea")[0].focus();
                $(".double_row-looks_good-button").removeClass("is-loading");
                $(".first_row-next-button").removeClass("is-loading");
            });
        });
    });
    
    $(".double_row-looks_good-button").click(function () {
        $(".double_row-looks_good-button").addClass("is-loading");
        submitFormTo(".main_form", handle_double_row_looks_good, alert);
    });

    
    $(".second_row-next-button").click(function () {
        insert_attrs_to(".second_row-input-section textarea", "second_queries[]", headings.length);
        $(".second_row-next-button").addClass("is-loading");
        submitFormTo(".main_form", handle_second_row_next_success, alert);
    });
    
    $(".second_row-back-button").click(function () {
        $(".second_row-input-section textarea").attr("name", "disabled[]");
        $(".second_row-next-button").removeClass("is-loading");
        $(".second_row-input-section").fadeOut("fast", function() {
            $(".first_row-completed-section").fadeOut(200, function () {
                insert_attrs_to(".second_row-input-section textarea", "disabled[]", headings.length);
                $(".first_row-input-section").fadeIn(200);
                $(".first_row-input-section textarea")[0].focus()
                $(".first_row-next-button").removeClass("is-loading");
            });
        });
    });
    
    $(".second_row-preview-back-button").click(function () {
        console.log(breadcrumb_path);
        $(".empty_url_list").attr("name", "disabled[]");
        $(".second_row-preview-section").fadeOut("fast", function() {
            var choices = [".second_row-input-section", ".double_row-preview-section"];
            var choice = last_from(choices, breadcrumb_path);
            if (choice == ".second_row-input-section") {
                $(".second_row-completed-section").fadeOut(200, function () {
                    insert_attrs_to(".second_row-input-section textarea", "disabled[]", headings.length);
                    $(".second_row-input-section").fadeIn(200);
                    $(".second_row-input-section textarea")[0].focus()
                });
            } else {
                $(choice).fadeIn(200);
            }
        	$(".second_row-looks_good-button").removeClass("is-loading");
        });
    });
    
    $(".second_row-missing_data-button").click(function () {
        $(".second_row-preview-section").fadeOut(200, function () {
            show_elements_to(".third_row-input-section .column", headings.length);
            insert_text(".third_row-input-section .columns .label", headings);
            $(".third_row-input-section").fadeIn(200);
            $(".second_row-input-section textarea")[0].focus();
        });
    });
    
    $(".second_row-looks_good-button").click(function () {
    	// FIXME download CS here?
        $(".second_row-looks_good-button").addClass("is-loading");
    	$(".empty_url_list").attr("name", "url_list");
        submitFormTo2(".main_form", handle_second_page_looks_good, alert);
        // alert(JSON.stringify($(".main_form").serializeJSON()));
    });

    
    $(".third_row-back-button").click(function () {
        $(".third_row-input-section textarea").attr("name", "disabled[]");
        $(".third_row-next-button").removeClass("is-loading");
        $(".third_row-input-section").fadeOut("fast", function() {
            $(".second_row-completed-section").fadeOut(200, function () {
                $(".second_row-preview-section").fadeIn(200);
            });
        });
    });
    
    $(".third_row-next-button").click(function () {
        insert_attrs_to(".third_row-input-section textarea", "extra_queries[]", headings.length);
        $(".third_row-next-button").addClass("is-loading");
        submitFormTo(".main_form", handle_third_row_next_success, alert);
    });
    
    $(".third_row-looks_good-button").click(function () {
    	// FIXME download CS here?
        $(".third_row-looks_good-button").addClass("is-loading");
    	$(".empty_url_list").attr("name", "url_list");
        submitFormTo2(".main_form", handle_second_page_looks_good, alert);
        // alert(JSON.stringify($(".main_form").serializeJSON()));
    });
    
    $(".third_row-missing_data-button").click(function () {
        alert("cannot complete");
    });
    
    $(".third_row-preview-back-button").click(function () {
        $(".third_row-input-section textarea").attr("name", "disabled[]");
        $(".empty_url_list").attr("name", "disabled[]");
        $(".third_row-preview-section").fadeOut("fast", function() {
            $(".third_row-completed-section").fadeOut(200, function () {
                $(".third_row-input-section").fadeIn(200);
                $(".third_row-input-section textarea")[0].focus()                
        		$(".third_row-looks_good-button").removeClass("is-loading");
            });
        });
    });

    
    $(".url_list-next-button").click(function () {
        $(".url_list-input-section textarea").attr("name", "url_list");
        $(".url_list-next-button").addClass("is-loading");
        submitFormTo2(".main_form", handle_second_page_looks_good, alert);
    });
});