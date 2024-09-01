package langmapper

// LanguageInfo holds information about a programming language.
type LanguageInfo struct {
	IconURL  string `json:"iconUrl"`
	Color    string `json:"color"`
	Language string `json:"language"`
}

var Languages = map[string]LanguageInfo{
	".py": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
		Color:    "#3572A5",
		Language: "Python",
	},
	".js": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
		Color:    "#F7DF1E",
		Language: "JavaScript",
	},
	".jsx": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
		Color:    "#61DAFB",
		Language: "JavaScript (JSX)",
	},
	".java": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
		Color:    "#B07219",
		Language: "Java",
	},
	".cpp": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
		Color:    "#F34B7D",
		Language: "C++",
	},
	".h": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
		Color:    "#F34B7D",
		Language: "C++ Header",
	},
	".c": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
		Color:    "#555555",
		Language: "C",
	},
	".rb": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
		Color:    "#701516",
		Language: "Ruby",
	},
	".php": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
		Color:    "#4F5D95",
		Language: "PHP",
	},
	".go": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
		Color:    "#00ADD8",
		Language: "Go",
	},
	".html": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
		Color:    "#E34C26",
		Language: "HTML",
	},
	".css": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
		Color:    "#563D7C",
		Language: "CSS",
	},
	".swift": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
		Color:    "#F05138",
		Language: "Swift",
	},
	".ts": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
		Color:    "#2B7489",
		Language: "TypeScript",
	},
	".tsx": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
		Color:    "#2B7489",
		Language: "TypeScript (TSX)",
	},
	".r": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
		Color:    "#198CE7",
		Language: "R",
	},
	".pl": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/perl/perl-original.svg",
		Color:    "#0298C3",
		Language: "Perl",
	},
	".scala": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
		Color:    "#C22D40",
		Language: "Scala",
	},
	".kt": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
		Color:    "#A97BFF",
		Language: "Kotlin",
	},
	".kts": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
		Color:    "#A97BFF",
		Language: "Kotlin Script",
	},
	".sh": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
		Color:    "#89E051",
		Language: "Shell Script",
	},
	".md": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg",
		Color:    "#083FA1",
		Language: "Markdown",
	},
	".sql": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
		Color:    "#E38C00",
		Language: "SQL",
	},
	".dart": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
		Color:    "#00B4AB",
		Language: "Dart",
	},
	".lua": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg",
		Color:    "#000080",
		Language: "Lua",
	},
	".groovy": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/groovy/groovy-original.svg",
		Color:    "#4298B8",
		Language: "Groovy",
	},
	".m": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/objectivec/objectivec-plain.svg",
		Color:    "#438EFF",
		Language: "Objective-C",
	},
	".mm": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/objectivec/objectivec-plain.svg",
		Color:    "#6866FB",
		Language: "Objective-C++",
	},
	".rs": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
		Color:    "#DEA584",
		Language: "Rust",
	},
	".v": {
		IconURL:  "https://cdn.jsdelivr.net/gh/file-icons/icons/svg/Verilog.svg",
		Color:    "#B2B7F8",
		Language: "Verilog",
	},
	".cob": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
		Color:    "#4B5F0F",
		Language: "COBOL",
	},
	".cbl": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
		Color:    "#4B5F0F",
		Language: "COBOL",
	},
	".fs": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fsharp/fsharp-original.svg",
		Color:    "#B845FC",
		Language: "F#",
	},
	".fsx": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fsharp/fsharp-original.svg",
		Color:    "#B845FC",
		Language: "F# Script",
	},
	".vhdl": {
		IconURL:  "https://cdn.jsdelivr.net/gh/file-icons/icons/svg/VHDL.svg",
		Color:    "#ADB2CB",
		Language: "VHDL",
	},
	".xml": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xml/xml-original.svg",
		Color:    "#0060AC",
		Language: "XML",
	},
	".yml": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yaml/yaml-original.svg",
		Color:    "#CB171E",
		Language: "YAML",
	},
	".yaml": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yaml/yaml-original.svg",
		Color:    "#CB171E",
		Language: "YAML",
	},
	".json": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg",
		Color:    "#292929",
		Language: "JSON",
	},
	".dockerfile": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
		Color:    "#384D54",
		Language: "Dockerfile",
	},
	"Makefile": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unix/unix-original.svg",
		Color:    "#427819",
		Language: "Makefile",
	},
	".tf": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
		Color:    "#7B42BC",
		Language: "Terraform",
	},
	".hcl": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hashicorp/hashicorp-original.svg",
		Color:    "#7B42BC",
		Language: "HCL",
	},
	".ex": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg",
		Color:    "#6E4A7E",
		Language: "Elixir",
	},
	".exs": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg",
		Color:    "#6E4A7E",
		Language: "Elixir Script",
	},
	".erl": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/erlang/erlang-original.svg",
		Color:    "#B83998",
		Language: "Erlang",
	},
	".hrl": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/erlang/erlang-original.svg",
		Color:    "#B83998",
		Language: "Erlang Header",
	},
	".clj": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/clojure/clojure-original.svg",
		Color:    "#DB5855",
		Language: "Clojure",
	},
	".cljs": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/clojure/clojure-original.svg",
		Color:    "#DB5855",
		Language: "ClojureScript",
	},
	".elm": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elm/elm-original.svg",
		Color:    "#60B5CC",
		Language: "Elm",
	},
	".styl": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/stylus/stylus-original.svg",
		Color:    "#FF6347",
		Language: "Stylus",
	},
	".less": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/less/less-plain-wordmark.svg",
		Color:    "#1D365D",
		Language: "Less",
	},
	".sass": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
		Color:    "#CF649A",
		Language: "Sass",
	},
	".scss": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
		Color:    "#CF649A",
		Language: "SCSS",
	},
	".hs": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg",
		Color:    "#5E5086",
		Language: "Haskell",
	},
	".jl": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/julia/julia-original.svg",
		Color:    "#A270BA",
		Language: "Julia",
	},
	".cr": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/crystal/crystal-original.svg",
		Color:    "#000100",
		Language: "Crystal",
	},
	".nim": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nim/nim-original.svg",
		Color:    "#37775B",
		Language: "Nim",
	},
	".ml": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ocaml/ocaml-original.svg",
		Color:    "#3BE133",
		Language: "OCaml",
	},
	".mli": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ocaml/ocaml-original.svg",
		Color:    "#3BE133",
		Language: "OCaml Interface",
	},
	".sol": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg",
		Color:    "#AA6746",
		Language: "Solidity",
	},
	".gdx": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
		Color:    "#5CE600",
		Language: "GAMS Data Exchange",
	},
	".m4": {
		IconURL:  "https://raw.githubusercontent.com/file-icons/icons/master/svg/M.svg",
		Color:    "#4A76B8",
		Language: "M4",
	},
	".rkt": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/racket/racket-original.svg",
		Color:    "#3E5BA9",
		Language: "Racket",
	},
	".asm": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/assembly/assembly-original.svg",
		Color:    "#6E4C13",
		Language: "Assembly",
	},
	".awk": {
		IconURL:  "https://raw.githubusercontent.com/file-icons/icons/master/svg/Awk.svg",
		Color:    "#4A464F",
		Language: "Awk",
	},
	".tcl": {
		IconURL:  "https://raw.githubusercontent.com/file-icons/icons/master/svg/Tcl.svg",
		Color:    "#1E5CB3",
		Language: "Tcl",
	},
	".ps": {
		IconURL:  "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_postscript.svg",
		Color:    "#D91A1A",
		Language: "PostScript",
	},
	".tex": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/latex/latex-original.svg",
		Color:    "#008080",
		Language: "LaTeX",
	},
	".scm": {
		IconURL:  "https://raw.githubusercontent.com/file-icons/icons/master/svg/Scheme.svg",
		Color:    "#1E4AEC",
		Language: "Scheme",
	},
	".ada": {
		IconURL:  "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_ada.svg",
		Color:    "#02F88C",
		Language: "Ada",
	},
	".xslt": {
		IconURL:  "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_xsl.svg",
		Color:    "#EB8CEB",
		Language: "XSLT",
	},
	".sml": {
		IconURL:  "https://raw.githubusercontent.com/file-icons/icons/master/svg/SML.svg",
		Color:    "#DC311E",
		Language: "Standard ML",
	},
	".cmake": {
		IconURL:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cmake/cmake-original.svg",
		Color:    "#064F8C",
		Language: "CMake",
	},
	".do": {
		IconURL:  "https://raw.githubusercontent.com/file-icons/icons/master/svg/Stata.svg",
		Color:    "#3776AB",
		Language: "Stata",
	},
}
