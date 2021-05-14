$(window).on('load', function () {
    var data = {
        init: 'solid',
        transitions: [
            { name: 'melt',     from: 'solid',  to: 'liquid' },
            { name: 'freeze',   from: 'liquid', to: 'solid'  },
            { name: 'vaporize', from: 'liquid', to: 'gas'    },
            { name: 'condense', from: 'gas',    to: 'liquid' }
        ],
        methods: {
            onMelt:     function () { console.log('I melted');    },
            onFreeze:   function () { console.log('I froze');     },
            onVaporize: function () { console.log('I vaporized'); },
            onCondense: function () { console.log('I condensed'); }
            }
    }
    // var domains = ["http://scrapetacular-ipv6.ydns.eu:7177", "http://127.0.0.1:10001", "http://127.0.0.1:10005"]
    // var domain_alive = {}

    
    const cors_get_request = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        mode: 'cors',
        cache: 'default'
    };

    const api_domain = "http://scrapetacular-ipv6.ydns.eu:7177"

    
    
    // for (let domain of domains) {
   	fetch(api_domain + "/alive", cors_get_request)
   	.then((response) => {
   		console.log("API working: " + api_domain);
   		return response;
   	})
   	.catch((error) => {
   		console.log("API failing: " + api_domain);
   		alert("Scraping server down, please email if you need access")
   	})
    // }
    
// your code here…
    var fsm = new StateMachine(data);
    fsm.melt();
    var headings = [];
    var breadcrumb_path = [];
    $(".url-input-section input")[0].focus()
    $(".url-input-section input").keyup(function(event) {
        if (event.keyCode === 13) {
            $(".url-next-button").click();
        }
    });
    $(".second_url-input-section input").keyup(function(event) {
        if (event.keyCode === 13) {
            $(".second_url-next-button").click();
        }
    });

    $(".next-button").click(function () {
        $(".next-button-section").fadeOut("fast", function() {
            $(".preview-button-section").fadeIn();
        });
    })
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
    $('.headings-input-section input').keyup(keyup_input_success);
    $('.headings-input-section input').each(initial_input_success);
    
    $(".url-next-button").click(function () {
        const raw_url = get_values(".url-input-section input");
        console.log(raw_url);
        $(".big_title_header .subtitle").slideUp(200);
        $(".big_title_header .title").slideUp(200);
        $(".url-input-section").fadeOut("fast", function() {
            insert_text(".url-completed-section .subtitle", raw_url);
            $(".url-completed-section").fadeIn(300, function() {
                breadcrumb_path.push(".url-input-section");
                $(".headings-input-section").fadeIn(1000);
                $(".headings-input-section input")[0].focus()
                submitAutocomplete("blank", console.log)
            });
        });
    });
    function get_values(query) {
        return $(query).map(function (idx, elem) {
            return $(elem).val();
        }).get();
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
    function insert_text(query, string_list) {     
        $(query).each(function (idx, elem) {
            $(elem).text(string_list[idx]);
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
    function insert_attrs_to(query, attr_value, limit) {      
        $(query).each(function (idx, elem) {
            if (idx < limit) {
                $(elem).attr("name", attr_value);
            } else {
                $(elem).removeAttr("name");
            }
        });
    }
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
                    breadcrumb_path.push("..headings-input-section");
                    $(".first_row-input-section").fadeIn(200);
                    $(".first_row-input-section textarea")[0].focus()
                });
            });
        }
    });
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
    function build_table_structure(table_headings, table_rows) {
        var table_structure = [];
        
        for (let table_row of table_rows) {
            var entry = {};
            for (const [index, cell] of table_row.entries()) {
                entry[table_headings[index]] = cell;
            }
            table_structure.push(entry);
        }
        return table_structure;
    }
    function add_value_to_input(query, values, limit) {
        $(query).each(function (idx, elem) {
            if (idx < limit) {
                $(elem).val(values[idx]);
            }
        });
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
            alert("no pattern found automatially")
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
    $(".double_row-looks_good-button").click(function () {
        $(".double_row-looks_good-button").addClass("is-loading");
        submitFormTo(".main_form", handle_double_row_looks_good, alert);
    });
    $(".first_row-next-button").click(function () {
        const raw_first_row_data = get_values(".first_row-input-section textarea");
        $(".first_row-next-button").addClass("is-loading");
        submitFormTo(".main_form", handle_first_row_next_success, alert);
    });
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
    $(".second_row-next-button").click(function () {
        insert_attrs_to(".second_row-input-section textarea", "second_queries[]", headings.length);
        $(".second_row-next-button").addClass("is-loading");
        submitFormTo(".main_form", handle_second_row_next_success, alert);
    });
    $(".second_page_first_row-next-button").click(function () {
        $(".second_page_first_row-next-button").addClass("is-loading");
        insert_attrs_to(".second_page_first_row-input-section textarea", "new_page_queries[]", headings.length);
        submitFormTo(".main_form", handle_second_page_first_row_next_success, alert);
    });
    function handle_second_page_first_row_next_success(preview_data) {
        const raw_first_row_data = get_values(".second_page_first_row-input-section textarea");
        $(".second_page_first_row-input-section").fadeOut(200, function () {
            show_elements_to(".second_page_first_row-completed-section .column", headings.length);
            insert_text(".second_page_first_row-completed-section .subtitle", headings);
            insert_text(".second_page_first_row-completed-section code", raw_first_row_data);
            $(".second_page_first_row-completed-section").fadeIn(200, function () {
                breadcrumb_path.push(".second_page_first_row-input-section");
                $(".second_page_first_row-preview-section .data_preview-table-container table").remove();
                var table_structure = build_table_structure(headings, preview_data);
                build_and_append_table(".second_page_first_row-preview-section .data_preview-table-container", table_structure);
                $(".second_page_first_row-preview-section").fadeIn(200);
                $(".second_page_first_row-next-button").removeClass("is-loading");
            })
        })
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
    function handle_second_url_next_success(preview_data) {
        const raw_second_url_data = $(".second_url-input-section input").val();
        $(".second_url-input-section").fadeOut(200, function () {
            insert_text(".second_url-completed-section .subtitle", [raw_second_url_data]);
            $(".second_url-completed-section").fadeIn(200, function() {
                breadcrumb_path.push(".second_url-input-section");
                $(".second_page-preview-section .data_preview-table-container table").remove();
                var table_structure = build_table_structure(headings, preview_data);
                build_and_append_table(".second_page-preview-section .data_preview-table-container", table_structure);
                $(".second_url-next-button").removeClass("is-loading");
                $(".second_page-preview-section").fadeIn(200);
            });
        });
    }
    $(".second_url-next-button").click(function () {
        $(".second_url-input-section input").attr("name", "secondary_url");
        $(".second_url-next-button").addClass("is-loading");
        submitFormTo(".main_form", handle_second_url_next_success, alert);
    })
    $(".third_row-next-button").click(function () {
        insert_attrs_to(".third_row-input-section textarea", "extra_queries[]", headings.length);
        $(".third_row-next-button").addClass("is-loading");
        submitFormTo(".main_form", handle_third_row_next_success, alert);
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
    $(".third_row-back-button").click(function () {
        $(".third_row-input-section textarea").attr("name", "disabled[]");
        $(".third_row-next-button").removeClass("is-loading");
        $(".third_row-input-section").fadeOut("fast", function() {
            $(".second_row-completed-section").fadeOut(200, function () {
                $(".second_row-preview-section").fadeIn(200);
            });
        });
    });
    $(".second_page_first_row-back-button").click(function () {
        $(".second_page_first_row-input-section textarea").attr("name", "disabled[]");
        $(".second_page_first_row-next-button").removeClass("is-loading");
        $(".second_page_first_row-input-section").fadeOut(200, function () {
            $(".second_url-completed-section").fadeOut(200, function () {
                $(".second_page-preview-section").fadeIn(200);
            });
        });
    });
    $(".first_row-preview-back-button").click(function () {
        $(".first_row-preview-section").fadeOut("fast", function() {
            $(".first_row-completed-section").fadeOut(200, function () {
                $(".first_row-input-section").fadeIn(200);
                $(".first_row-input-section textarea")[0].focus()
                $(".first_row-next-button").removeClass("is-loading");
            });
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
    $(".second_row-preview-back-button").click(function () {
        console.log(breadcrumb_path);
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
        });
    });
    $(".third_row-preview-back-button").click(function () {
        $(".third_row-input-section textarea").attr("name", "disabled[]");
        $(".third_row-preview-section").fadeOut("fast", function() {
            $(".third_row-completed-section").fadeOut(200, function () {
                $(".third_row-input-section").fadeIn(200);
                $(".third_row-input-section textarea")[0].focus()
            });
        });
    });
    $(".second_page_first_row-preview-back-button").click(function () {
        $(".second_page_first_row-input-section textarea").attr("name", "disabled[]");
        $(".second_page_first_row-preview-section").fadeOut("fast", function() {
            $(".second_page_first_row-completed-section").fadeOut(200, function () {
                $(".second_page_first_row-input-section").fadeIn(200);
                $(".second_page_first_row-input-section textarea")[0].focus()
            });
        });
    });
    $(".second_page-preview-back-button").click(function () {
        $(".second_url-input-section input").attr("name", "disabled[]");
        $(".second_page-preview-section").fadeOut(200, function () {
            $(".second_url-completed-section").fadeOut(200, function () {
                $(".second_url-input-section").fadeIn(200);
                $(".second_url-input-section input")[0].focus()
            });
        });
    });
    $(".second_page_first_row-looks_good-button").click(function () {
        $(".second_page_first_row-preview-section").fadeOut(200, function () {
            $(".url_list-input-section").fadeIn(200);
            $(".url_list-input-section textarea")[0].focus()
        });
    });
    $(".second_page-looks_good-button").click(function () {
        $(".second_page-preview-section").fadeOut(200, function () {
        	submitURLCanGenerate(get_current_url_list(), handle_urls_can_generate, alert);
            $(".url_list-input-section").fadeIn(200);
            $(".url_list-input-section textarea")[0].focus()
        });
    });
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
    }
    $(".url_list-next-button").click(function () {
        $(".url_list-input-section textarea").attr("name", "url_list");
        $(".url_list-next-button").addClass("is-loading");
        submitFormTo2(".main_form", handle_second_page_looks_good, alert);
    });
    function handle_urls_generated(new_url_list) {
    	const new_text = $(".url_list-input-section textarea").val().trim() + "\n" + new_url_list.join("\n")
    	$(".url_list-input-section textarea").val(new_text)
    }
    function handle_urls_can_generate(bool_value) {
    	$(".url_list-add1-button").attr("disabled", !bool_value);
    	$(".url_list-add10-button").attr("disabled",!bool_value);
    }
    function get_current_url_list() {
    	const raw_first_url_data = $(".url-input-section input").val();
    	const raw_second_url_data = $(".second_url-input-section input").val();
    	var url_list = [raw_first_url_data, raw_second_url_data]
    	var textarea_url_list = $(".url_list-input-section textarea").val().trim().split(/\r|\n/)
    	url_list = url_list.concat(textarea_url_list)
    	return url_list
    }
    $(".url_list-add1-button").click(function () {
        submitURLGenerate(get_current_url_list(), 1, handle_urls_generated, alert);
    });
    $(".url_list-add10-button").click(function () {
        submitURLGenerate(get_current_url_list(), 10, handle_urls_generated, alert);
    });
    $(".url_list-input-section textarea").on('input propertychange paste', function() {
        //my Textarea content has changed
        submitURLCanGenerate(get_current_url_list(), handle_urls_can_generate, alert);
    });
    $(".first_row-looks_good-button").click(function () {
        $(".first_row-preview-section").fadeOut(200, function () {
            breadcrumb_path.push(".first_row-preview-section");
            $(".second_url-input-section").fadeIn(200);
            $(".second_url-input-section input")[0].focus();
        });
    });
    $(".second_row-looks_good-button").click(function () {
        $(".second_row-preview-section").fadeOut(200, function () {
            breadcrumb_path.push(".second_row-preview-section");
            $(".second_url-input-section").fadeIn(200);
            $(".second_url-input-section input")[0].focus();
        });
    });
    $(".third_row-looks_good-button").click(function () {
        $(".third_row-preview-section").fadeOut(200, function () {
            breadcrumb_path.push(".third_row-preview-section");
            $(".second_url-input-section").fadeIn(200);
            $(".second_url-input-section input")[0].focus();
        });
    });
    $(".first_row-missing_data-button").click(function () {
        $(".first_row-preview-section").fadeOut(200, function () {
            show_elements_to(".second_row-input-section .column", headings.length);
            insert_text(".second_row-input-section .columns .label", headings);
            $(".second_row-input-section").fadeIn(200);
            $(".second_row-input-section textarea")[0].focus();
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
    $(".second_page-missing_data-button").click(function () {
        $(".second_page-preview-section").fadeOut(200, function () {
            show_elements_to(".second_page_first_row-input-section .column", headings.length);
            insert_text(".second_page_first_row-input-section .columns .label", headings);
            $(".second_page_first_row-input-section").fadeIn(200);
            $(".second_page_first_row-input-section textarea")[0].focus();
        });
    });
    $(".third_row-missing_data-button").click(function () {
        alert("cannot complete");
    });
    $(".second_page_first_row-missing_data-button").click(function () {
        alert("cannot complete");
    });
    $(".second_url-back-button").click(function () {
        console.log(breadcrumb_path);
        $(".second_url-next-button").removeClass("is-loading");
        $(".second_url-input-section input").attr("name", "disabled[]");
        $(".second_url-input-section").fadeOut(200, function () {
            var choices = [".third_row-preview-section", ".second_row-preview-section", ".first_row-preview-section"];
            var choice = last_from(choices, breadcrumb_path);
            $(last_from(choices, breadcrumb_path)).fadeIn(200);
        });
    });
    function last_from(choices, path) {
        for (let item of path.slice().reverse()) {
            if (choices.includes(item)) {
                return item;
            }
        }
    }
    function search_function(term, callback) {
        callback(cache[term], true); // Show local cache immediately.

        $.getJSON('/search', { q: term })
            .done(function (resp) {
                callback(resp); // `resp` must be an Array
            })
            .fail(function () {
                callback([]); // Callback must be invoked even if something went wrong.
            });
    }
    function get_string_overlap(string1, string2) {
        const shorter_length = Math.min(string1.length, string2.length);
        let result = null;
        let index = 0;
        while (index < shorter_length) {
            if (string1[index] === string1[index]) {
                result = string1.slice(0, index + 1);
            }
            index++;
        }
        return result;
    }
    $(".url_list-input-section textarea").textcomplete([
        {
            match: /^(\s*)(\S[\S\s]*)$/,
            search: function (term, callback) {
                const raw_second_url_data = $(".second_url-input-section input").val();
                const raw_first_url_data = $(".url-input-section input").val();
                
                var long_string = get_string_overlap(raw_first_url_data, raw_second_url_data);
                var mylist = ["https://get_next_url.info/next/time", "feidddddddd", "foesssssss", "fum", long_string];
                const result = mylist.filter(function (item) {
                    return item.toLowerCase().includes(term.toLowerCase())
                });
                console.log(result);
                console.log(term);
                callback(result);
            },
            replace: function (value) {
                return value;
            },
            maxCount: 3
        }
    ]);
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
            console.log(value);
            console.log(value.replace("$", "$$$$"))
            return value.replace("$", "$$$$");
        },
        template: function (value) {
            if (value.length < 100) {
                return value;
            }
            return value.slice(0, 45).concat("  ....  ").concat(value.slice(value.length - 45, value.length));
        }
    }];
    $(".first_row-input-section textarea").textcomplete(first_url_autocomplete_data);
    $(".second_row-input-section textarea").textcomplete(first_url_autocomplete_data);
    $(".third_row-input-section textarea").textcomplete(first_url_autocomplete_data);
    function submitAutocomplete2(term, callback) {
        const raw_url = get_values(".second_url-input-section input")[0];
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
    var second_url_autocomplete_data = [{
        match: /^(\s*)(\S[\S\s]*)$/,
        search: submitAutocomplete2,
        replace: function (value) {
            return value.replace("$", "$$$$");
        },
        template: function (value) {
            if (value.length < 100) {
                return value;
            }
            return value.slice(0, 45).concat("  ....  ").concat(value.slice(value.length - 45, value.length));
        }
    }];
    $(".second_page_first_row-input-section textarea").textcomplete(second_url_autocomplete_data);
    function submitURLGenerate(url_list, total, on_success, on_error) {
        const body = {
            url_list: url_list,
            number: total,
        }
        console.log(body)

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
        fetch(api_domain + '/urls', myInit)
            .then(response => response.json())
            .then(data => on_success(data))
            .catch((error) => {
                console.log("error");
                console.log(error);
                on_error(error);
            });
    }
    function submitURLCanGenerate(url_list, on_success, on_error) {
        const body = {
            url_list: url_list
        }
        console.log(body)

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
        fetch(api_domain + '/can_fill', myInit)
            .then(response => response.json())
            .then(data => on_success(data))
            .catch((error) => {
                console.log("error");
                console.log(error);
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
    function build_table(data) {
        if (data.length == 0) {
            return null;
        }
        var table = $("<table>");
        append_header(table, data[0]);
        append_rows(table, data);
        return table;
    }
    my_data = [
      {
        "UserID": 1,
        "UserName": "rooter",
        "Password": "12345",
        "Country": "UK",
        "Email": "sac@gmail.com"
      },
      {
        "UserID": 2,
        "UserName": "binu",
        "Password": "123",
        "Country": "uk",
        "Email": "Binu@gmail.com"
      },
      {
        "UserID": 3,
        "UserName": "cal",
        "Password": "123",
        "Country": "uk",
        "Email": "cal@gmail.com"
      },
      {
        "UserID": 4,
        "UserName": "nera",
        "Password": "1234",
        "Country": "uk",
        "Email": "nera@gmail.com"
      }
    ];
    function build_and_append_table(query, data) {
        $(query).append(build_table(data));
        $(query).find("tbody th").addClass("has-text-grey is-unselectable");
        $(query).find("table").addClass("table is-narrow is-hoverable is-fullwidth");
    }
    build_and_append_table(".uwotm9", my_data);
});