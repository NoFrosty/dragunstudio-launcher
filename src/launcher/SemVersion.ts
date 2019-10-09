export class SemVersion {
    
    public Major: number;
    
    public Minor: number;
    
    public Patch: number;
    
    public Prerelease: string;
    
    public Build: string;
    
    public constructor (major: number, minor: number = 0, patch: number = 0, prerelease: string = "", build: string = "") {
        this.Major = major;
        this.Minor = minor;
        this.Patch = patch;
        this.Prerelease = prerelease;
        this.Build = build;
    }
    
    public ToString(): string {
        let version = ("" 
                    + (this.Major + ("." 
                    + (this.Minor + ("." + this.Patch)))));
        if (this.Prerelease) {
            version = (version + ("-" + this.Prerelease));
        }
        
        if (this.Build) {
            version = (version + ("+" + this.Build));
        }
        
        return version;
    }
    
    public Equals(obj: SemVersion): boolean {
        
        return ((this.Major == obj.Major) 
                    && ((this.Minor == obj.Minor) 
                    && ((this.Patch == obj.Patch) 
                    && (this.Prerelease == obj.Prerelease
                    && this.Build == obj.Build))));
    }
}