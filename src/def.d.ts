interface Manifest {
    name: string;
    description: string;
    license: string;
    main?: string;
}

type InitOpts = {
    typescript: boolean;
    license: string;
};
