

## Como se usan?


Los grupos en [[Three js]] se usan para afectar y mover multiples elementos agrupados  

````js
  

const group = new THREE.Group()

group.position.y = -1

scene.add(group)

  

const geomtry = new THREE.BoxGeometry(1,1,1)

const material = new THREE.MeshBasicMaterial({color:"red"})

const mesh = new THREE.Mesh(geomtry, material)

  

const geomtry2 = new THREE.BoxGeometry(1,1,1)

const material2 = new THREE.MeshBasicMaterial({color:"yellow"})

const mesh2 = new THREE.Mesh(geomtry2, material2)

  
  
  

group.add(mesh)

group.add(mesh2)
````



