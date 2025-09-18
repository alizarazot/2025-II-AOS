{
  description = "AOS";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/25.05";
  outputs = inputs @ {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
  in {
    devShells.${system}.default = let
      pkgs = nixpkgs.legacyPackages.${system};
    in
      pkgs.mkShell {
        packages = [
          pkgs.nodePackages.nodejs
        ];
      };
  };
}
