
## Como funciona?

Es una cámara muy parecida a la cámara [[Perpective camera]] su principal diferencia es que no utiliza la perspectiva para definir el tamaño de un elemento es decir si un elemento esta muy cerca o muy lejos de la cámara tendrán un mismo tamaño definido, la forma en que el render de este se basa en left , top , right , bottom que es mas como una foto en cuestión de un elemento   


````js
// left , right , top ,bottom , near , far
const camera = new THREE.OrthographicCamera(-1,1,1,-1, 1, 100)
````