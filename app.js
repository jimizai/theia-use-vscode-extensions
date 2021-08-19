const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");

const USER_HOME = process.env.HOME || process.env.USERPROFILE;
const extensions_dir = path.resolve(USER_HOME, ".vscode/extensions");
const dist_dir = path.resolve(USER_HOME, ".theia/extensions");

const contentName = "[Content_Types].xml";
const vsix = "extension.vsixmanifest";
const extensionDir = "extension";
let id = 10000;

const vsixContent = (id, name) => `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/${id}" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/${id}">
  <Metadata>
    <Identity Language="en-US" Id="rider-theme" Version="1.1.0" Publisher="muhammad-sammy"/>
    <DisplayName>${name}</DisplayName>
    <Description xml:space="preserve"></Description>
    <Tags>VSCode,Themes,theme,rider,resharper,color-theme</Tags>
    <Categories>Themes,Other</Categories>
    <GalleryFlags>Public</GalleryFlags>
    <Badges></Badges>
    <Properties>
      <Property Id="Microsoft.VisualStudio.Code.Engine" Value="^1.40.0" />
      <Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value="" />
      <Property Id="Microsoft.VisualStudio.Code.ExtensionPack" Value="" />
      <Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="ui" />
      <Property Id="Microsoft.VisualStudio.Code.LocalizedLanguages" Value="" />
      
        <Property Id="Microsoft.VisualStudio.Services.Links.Source" Value="https://github.com/muhammadsammy/rider-themes-vscode" />
        <Property Id="Microsoft.VisualStudio.Services.Links.Getstarted" Value="https://github.com/muhammadsammy/rider-themes-vscode" />
        
          <Property Id="Microsoft.VisualStudio.Services.Links.GitHub" Value="https://github.com/muhammadsammy/rider-themes-vscode" />
        
      
      <Property Id="Microsoft.VisualStudio.Services.Links.Support" Value="https://github.com/muhammadsammy/rider-themes-vscode/issues" />
      <Property Id="Microsoft.VisualStudio.Services.Links.Learn" Value="https://github.com/muhammadsammy/rider-themes-vscode" />
      
      
      <Property Id="Microsoft.VisualStudio.Services.GitHubFlavoredMarkdown" Value="true" />
      
      
      
    </Properties>
    <License>extension/LICENSE.txt</License>
    
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code"/>
  </Installation>
  <Dependencies/>
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
    <Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true" /><Asset Type="Microsoft.VisualStudio.Services.Content.Changelog" Path="extension/CHANGELOG.md" Addressable="true" /><Asset Type="Microsoft.VisualStudio.Services.Content.License" Path="extension/LICENSE.txt" Addressable="true" />
  </Assets>
</PackageManifest>

`;

const contentTypeText = (id) => `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/${id}/content-types">
  <Default Extension=".json" ContentType="application/json"/><Default Extension=".md" ContentType="text/markdown"/><Default Extension=".js" ContentType="application/javascript"/><Default Extension=".txt" ContentType="text/plain"/><Default Extension=".vsixmanifest" ContentType="text/xml"/>
</Types>`;

(async () => {
  const dirs = fs
    .readdirSync(extensions_dir)
    .filter((item) => item !== ".DS_Store" && item !== ".obsolete");

  if (!fs.existsSync(path.resolve(USER_HOME, ".theia"))) {
    fs.mkdirSync(path.resolve(USER_HOME, ".theia"));
  }
  if (!fs.existsSync(dist_dir)) {
    fs.mkdirSync(dist_dir);
  }
  for (let dir of dirs) {
    id++;
    const pkg = path.resolve(extensions_dir, dir, "package.json");
    const exits = fs.existsSync(pkg);
    if (exits) {
      const data = require(pkg);
      const name = data.name;
      const vsixText = vsixContent(id, name);
      const content = contentTypeText(id);
      if (!fs.existsSync(path.resolve(dist_dir, dir))) {
        fs.mkdirSync(path.resolve(dist_dir, dir));
      }

      fs.writeFileSync(path.resolve(dist_dir, dir, vsix), vsixText, "utf8");
      fs.writeFileSync(
        path.resolve(dist_dir, dir, contentName),
        content,
        "utf8"
      );

      fse.copySync(
        path.resolve(extensions_dir, dir),
        path.resolve(dist_dir, dir, extensionDir)
      );
    }
  }
})();
