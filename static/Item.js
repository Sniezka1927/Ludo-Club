class Item extends THREE.Mesh {

    constructor(BoardColor, size, img) {
        super()
        console.log('generated')
        this.geometry = new THREE.BoxGeometry(size, size, size);
        this.material = new THREE.MeshBasicMaterial({
            color: BoardColor,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: false,
            opacity: 1,
            map: new THREE.TextureLoader().load(img),

        });
        this.cube = new THREE.Mesh(this.geometry, this.material);

    }
}
