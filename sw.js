console.log("hello depuis le service worker");
	
const cacheName = 'veille-techno' + '1.2';
 
self.addEventListener('install', (evt) => {
    console.log(`sw installé à ${new Date().toLocaleTimeString()}`);
 
    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
            //'index.html',
            'main.js',
            'style.css',
            'vendors/bootstrap4.min.css',
            'add_techno.html',
            'add_techno.js',
            'contact.html',
            'contact.js',
        ])
        .then(console.log('cache initialisé'))
        .catch(console.err);
    });
 
    evt.waitUntil(cachePromise);
 
});
 
	
self.addEventListener('activate', (evt) => {
    console.log(`sw activé à ${new Date().toLocaleTimeString()}`); 
  
    // 5.4 Supprimer les anciennes instances de cache
    let cacheCleanPromise = caches.keys().then(keys => {
        keys.forEach(key => {            
            if(key !== cacheName){
                caches.delete(key);
            }
        });
    });
 
    evt.waitUntil(cacheCleanPromise);
});
 
self.addEventListener('fetch', (evt) => {
    console.log('sw intercepte la requête suivante via fetch', evt);
    console.log('url interceptée', evt.request.url);
});

/*	
self.addEventListener('fetch', (evt) => {
    if(!navigator.onLine) {
        const headers = { headers: { 'Content-Type': 'text/html;charset=utf-8'} };
        evt.respondWith(new Response('<h1>Pas de connexion internet</h1><div>Application en mode dégradé. Veuillez vous connecter</div>', headers));
    }
 
    console.log('sw intercepte la requête suivante via fetch', evt);
    console.log('url interceptée', evt.request.url);

    evt.respondWith(
    
        caches.match(evt.request)
            .then(cachedResponse => {   
                if (cachedResponse) {
               		// identification de la requête trouvée dans le cache
                    console.log("url depuis le cache", evt.request.url);
                    return cachedResponse;
                }
 
                // 5.1 Stratégie de cache
                return fetch(evt.request).then(
                    // On récupère la requête
                    function(newResponse) {
                    	// identification de la requête ajoutée au cache
                        console.log("url depuis le réseau et mise en cache", evt.request.url);
                        
                        // Accès au cache
                        caches.open(cacheName).then(
                            function(cache){
                                // ajout du résultat de la requête au cache
                                cache.put(evt.request, newResponse);
                            }
                        );
                        // Utilisation de clone car on ne peut utiliser qu'une fois la réponse
                        return newResponse.clone();
                    }
                )
            }
        )
    );
});
*/
	
self.addEventListener('fetch', (evt) => {
 
    // 5.3 Stratégie de network first with cache fallback
    // On doit envoyer une réponse
    evt.respondWith(
        // on doit d'abord faire une requête sur le réseau de ce qui a été intercepté
        fetch(evt.request).then(res => {
            console.log("url récupérée depuis le réseau", evt.request.url);
            // mettre dans le cache le résultat de cette réponse : en clef la requête et en valeur la réponse
            caches.open(cacheName).then(cache => cache.put(evt.request, res));
            // quand on a la réponse on la retourne (clone car on ne peut la lire qu'une fois)
            return res.clone();
        })
        // Si on a une erreur et que l'on arrive pas à récupérer depuis le réseau, on va chercher dans le cache
        .catch(err => {
            console.log("url récupérée depuis le cache", evt.request.url);
            return caches.match(evt.request);
        })
    );
})
/*
// 7.3 Notifications persistantes (envoyées depuis le service worker)
// Affichage de la notification
self.registration.showNotification("Notification du SW", {
    body: "je suis une notification dite persistante",
    actions: [
        { action: "accept", title: "accepter" },
        { action: "refuse", title: "refuser" }
    ]
})

// Ecoute de l'événement close
self.addEventListener("notificationclose", evt => {
    console.log("Notification fermée", evt);
})

self.addEventListener("notificationclick", evt => {
    console.log("notificationclick evt", evt);
    if (evt.action === "accept") {
        console.log("vous avez accepté");
    } else if (evt.action === "refuse") {
        console.log("vous avez refusé");
    } else {
        console.log("vous avez cliqué sur la notification (pas sur un bouton)");
    }
    evt.notification.close();
})*/


self.addEventListener("push", evt => {
    console.log("push event", evt);
    console.log("data envoyée par la push notification :", evt.data.text());

    // 8.1 afficher son contenu dans une notification
    const title = evt.data.text();
    const objNotification = {
        body: "ça fonctionne",
        icon: "images/icons/icon-72x72.png"
    };
    self.registration.showNotification(title, objNotification);
})