export const DefaultLayout = ({ head, body }) => {
  return /*html*/ `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<script src="./main.js" type="module"></script>
		<style>
			html,
			body {
				margin: 0px;
				padding: 0px;
				height: 100%;
			}
		</style>
		<link rel="stylesheet" href="global.css" />
		${head}
	</head>
	<body>
		<header class="hero">
			<h2><a href="/">sethwhite.dev</a></h2>
			<div class="row gap-3">
				<a href="https://github.com/hyrumwhite">Github</a>
				<a href="https://twitter.com/fluffydev">Twitter</a>
				<a href="https://www.linkedin.com/in/hyrumswhite/">LinkedIn</a>
			</div>
		</header>
		<main id="main-outlet" class="column">
			${body}
		</main>
	</body>
</html>`;
};
