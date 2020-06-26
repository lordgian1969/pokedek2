var nombrePokemon;
window.onload = function () {
    mostrarPokemones();

    $("#boton1").click(function consultar() {
        nombrePokemon = $('#nombre-pokemon').val();
        if (nombrePokemon == "") {
            $("#nombre-pokemon").attr("placeholder", "Debe ingresar Pokemon").val("").focus().blur();;
        } else {
            //Se busca a pokemon por nombre
            $.ajax({
                url: "https://pokeapi.co/api/v2/pokemon?offset=0&limit=860",
                dataType: 'json',
                success: function (result, status, xhr) {
                    var url_encon="";
                    for (var poke of result["results"]) {
                        if (poke.name.toLowerCase() === nombrePokemon.toLowerCase()) {
                            url_encon = poke.url;
                        }
                    }

                    if(!url_encon==""){
                        buscar(url_encon);
                    }else{
                        $("#nombre-pokemon").attr("placeholder", "!!Pokemon No Encontrado").val("").focus().blur();;
                    }
                }
            });
        };
    });


    //Con esta funncion, muestra nuevamente lista de pokemones
    $("#boton2").click(function () {
        $("#chartContainer").hide();
        $("#imagen").hide();
        $("#target").show();
        mostrarPokemones();
    });


    //funcion que realiza busqueda de pokemones y los muestra en una lista
    function mostrarPokemones() {
        $.ajax({
            url: "https://pokeapi.co/api/v2/pokemon?offset=0&limit=860",
            dataType: 'json',
            success: function (result, status, xhr) {
                var urlencon;
                for (var poke of result["results"]) {
                    $("#lista").append("<li id='" + poke.name + "'> " + poke.name + "</li>");
                }
            }
        });
    };

    //funcion que busca al pokemon por su url con id.
    function buscar(url) {
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (result, status, xhr) {

                $("#target").hide();
                $("#imagen").show();
                let elemento = document.getElementById('imagen')
                elemento.innerHTML = `<img src='${result.sprites.front_default}'>
                                                            <p>${result.forms[0].name}
                                                               Tipo:${result.types[0].type.name}</p>`;
                creargrafico(result.forms[0].name, result.base_experience, result.height, result.weight, result.stats[0].base_stat)
                $("#nombre-pokemon").attr("placeholder", "Ingrese nombre Pokemon").val("").focus().blur();;
            }


        });
    }

    //crea graficos de estadistica con canvas
    function creargrafico(nombre, experiencia, altura, peso, estadistica) {
        var options = {
            animationEnabled: true,
            title: {
                text: nombre
            },
            axisY: {
                title: "Growth Rate (in %)",
                suffix: "%",
                includeZero: false
            },
            axisX: {
                title: ""
            },
            data: [{
                type: "column",
                yValueFormatString: "#,##0.0#" % "",
                dataPoints: [{
                        label: "Experiencia",
                        y: experiencia
                    },
                    {
                        label: "Altura",
                        y: altura
                    },
                    {
                        label: "Peso",
                        y: peso
                    },
                    {
                        label: "Estadistica",
                        y: estadistica
                    },


                ]
            }]
        };
        $("#chartContainer").show();
        $("#chartContainer").CanvasJSChart(options);

    }








}