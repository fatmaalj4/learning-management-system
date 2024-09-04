// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function()
{
    
    // document.querySelectorAll("button.ajoutCours").forEach(function(element)
    // {
    //     //var e = document.getElementById("listeCours").selectedIndex;
    //     //var text = e.options[e.selectedIndex].text;
        
    //     element.addEventListener("click", function()
    //     {
    //         e = document.getElementById("listeCours");
    //         selValue = e.options[e.selectedIndex].text;
    //         fetch("/api/v1/cours/ajoutCours/" + selValue, {
    //         }).then(function()
    //         {
    //             location.reload();
    //         })
    //         //alert(selValue);
    //         //alert(e );
    //     });
    // });

    document.querySelectorAll("button.supprimerCours").forEach(function(element)
    {
        
        element.addEventListener("click", function()
        {
            let cours = element.value;
            let token = document.location.pathname.split('=')[1];
            if (confirm("Etes vous certain de vouloir supprimer le cours "+cours+" ?"))
            {
                fetch(document.location.pathname+"/cours/supprimerCours/"+cours, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({'token': token})
                }).then(function()
                {
                    
                    location.reload();
                })
            }
        });
    });
        
});

