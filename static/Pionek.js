class Pionek extends THREE.Mesh {

    constructor(CheckerColor, checkerName, img) {
        super()
        this.geometry = new THREE.CylinderGeometry(5, 5, 3, 64);
        this.material = new THREE.MeshBasicMaterial({
            color: CheckerColor,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: false,
            opacity: 1,
            map: new THREE.TextureLoader().load(img),
        });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.cube.name = checkerName

    }
}