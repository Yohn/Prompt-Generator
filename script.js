const techStacks = {
	node: {
		frontend: ['React', 'Vue.js', 'Angular', 'Svelte', 'Astro', 'Next.js', 'Nuxt.js', 'Bootstrap 5.3.7', 'Pico CSS v2', 'Vanilla HTML/CSS/JS'],
		backend: ['Express.js', 'Fastify', 'Koa.js', 'NestJS', 'Hapi.js'],
		database: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Prisma ORM', 'Sequelize', 'TypeORM'],
		testing: ['Jest', 'Mocha', 'Vitest', 'Playwright', 'Cypress', 'Supertest']
	},
	php: {
		frontend: ['Bootstrap 5.3.7', 'Pico CSS v2', 'Vanilla HTML/CSS/JS', 'Vue.js', 'React', 'Alpine.js', 'Blade Templates', 'Twig'],
		backend: ['Laravel', 'Symfony', 'CodeIgniter', 'Slim Framework', 'Laminas', 'CakePHP', 'Vanilla PHP'],
		database: ['MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'Eloquent ORM', 'Doctrine ORM'],
		testing: ['PHPUnit', 'Pest', 'Codeception', 'Behat', 'Playwright', 'Cypress']
	}
};

function populateTechOptions() {
	const projectType = document.getElementById('projectType').value;
	const containers = ['frontendTech', 'backendTech', 'databaseTech', 'testingTech'];
	const categories = ['frontend', 'backend', 'database', 'testing'];

	containers.forEach((containerId, index) => {
		const container = document.getElementById(containerId);
		container.innerHTML = '';

		if (projectType && techStacks[projectType]) {
			const techs = techStacks[projectType][categories[index]];
			techs.forEach(tech => {
				const div = document.createElement('div');
				div.className = 'form-check mb-2';
				div.innerHTML = `
												<input class="form-check-input" type="checkbox" id="${tech.replace(/[^a-zA-Z0-9]/g, '')}" value="${tech}">
												<label class="form-check-label" for="${tech.replace(/[^a-zA-Z0-9]/g, '')}">${tech}</label>
										`;
				container.appendChild(div);
			});
		}
	});
}

function generateInstructions() {
	const formData = {
		projectType: document.getElementById('projectType').value,
		projectName: document.getElementById('projectName').value,
		projectDescription: document.getElementById('projectDescription').value,
		customGuidelines: document.getElementById('customGuidelines').value,
		projectStructure: document.getElementById('projectStructure').value,
		availableResources: document.getElementById('availableResources').value,
		guidelines: {
			typeHints: document.getElementById('typeHints').checked,
			semicolons: document.getElementById('semicolons').checked,
			tabIndentation: document.getElementById('tabIndentation').checked,
			oop: document.getElementById('oop').checked,
			vanillaJS: document.getElementById('vanillaJS').checked,
			unitTests: document.getElementById('unitTests').checked,
			restfulAPI: document.getElementById('restfulAPI').checked,
			securityPractices: document.getElementById('securityPractices').checked
		},
		selectedTech: {
			frontend: getSelectedTech('frontendTech'),
			backend: getSelectedTech('backendTech'),
			database: getSelectedTech('databaseTech'),
			testing: getSelectedTech('testingTech')
		}
	};

	const outputType = document.querySelector('input[name="outputType"]:checked').value;
	let output = '';

	if (outputType === 'copilot') {
		output = generateCopilotInstructions(formData);
	} else if (outputType === 'claude') {
		output = generateClaudeInstructions(formData);
	} else if (outputType === 'generation') {
		output = generateGenerationPrompt(formData);
	}

	document.getElementById('output').innerHTML = `<pre class="text-light mb-0">${output}</pre>`;
	document.getElementById('copyBtn').style.display = 'block';
}

function getSelectedTech(containerId) {
	const container = document.getElementById(containerId);
	const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
	return Array.from(checkboxes).map(cb => cb.value);
}

function generateCopilotInstructions(data) {
	let instructions = `# ${data.projectName}\n\n`;
	instructions += `${data.projectDescription}\n\n`;

	instructions += `## Tech stack in use\n\n`;

	if (data.selectedTech.backend.length > 0) {
		instructions += `### Backend\n\n`;
		data.selectedTech.backend.forEach(tech => {
			instructions += `- ${tech}\n`;
		});
		if (data.projectType === 'php') {
			instructions += `- PHP 8.2 or newer required\n`;
		}
		instructions += '\n';
	}

	if (data.selectedTech.frontend.length > 0) {
		instructions += `### Frontend\n\n`;
		data.selectedTech.frontend.forEach(tech => {
			instructions += `- ${tech}\n`;
		});
		instructions += '\n';
	}

	if (data.selectedTech.database.length > 0) {
		instructions += `### Database & Storage\n\n`;
		data.selectedTech.database.forEach(tech => {
			instructions += `- ${tech}\n`;
		});
		instructions += '\n';
	}

	if (data.selectedTech.testing.length > 0) {
		instructions += `### Testing\n\n`;
		data.selectedTech.testing.forEach(tech => {
			instructions += `- ${tech}\n`;
		});
		instructions += '\n';
	}

	instructions += `## Project and code guidelines\n\n`;

	if (data.guidelines.tabIndentation) instructions += `- Use tab indentation\n`;
	if (data.guidelines.oop) instructions += `- Follow Object-Oriented Programming principles\n`;
	if (data.guidelines.typeHints) instructions += `- Always use type hints in any language which supports them\n`;
	if (data.guidelines.semicolons) instructions += `- JavaScript/TypeScript should use semicolons\n`;
	if (data.guidelines.vanillaJS) instructions += `- Use vanilla JavaScript (no external frameworks)\n`;
	if (data.guidelines.unitTests) instructions += `- Unit tests are required, and are required to pass before PR\n`;
	if (data.guidelines.restfulAPI) instructions += `- Follow RESTful API design principles\n`;
	if (data.guidelines.securityPractices) instructions += `- Always follow good security practices\n`;

	if (data.customGuidelines) {
		instructions += `- ${data.customGuidelines.split('\n').join('\n- ')}\n`;
	}
	instructions += '\n';

	if (data.projectStructure) {
		instructions += `## Project structure\n\n`;
		instructions += `${data.projectStructure}\n\n`;
	}

	if (data.availableResources) {
		instructions += `## Resources\n\n`;
		instructions += `${data.availableResources}\n`;
	}

	return instructions;
}

function generateClaudeInstructions(data) {
	let instructions = `You are working on a ${data.projectType.toUpperCase()} project called "${data.projectName}".\n\n`;
	instructions += `## Project Overview\n${data.projectDescription}\n\n`;

	instructions += `## Technical Requirements\n\n`;
	instructions += `### Technology Stack\n`;

	if (data.selectedTech.backend.length > 0) {
		instructions += `**Backend:** ${data.selectedTech.backend.join(', ')}\n`;
		if (data.projectType === 'php') {
			instructions += `- Must use PHP 8.2 or newer\n`;
		}
	}
	if (data.selectedTech.frontend.length > 0) {
		instructions += `**Frontend:** ${data.selectedTech.frontend.join(', ')}\n`;
	}
	if (data.selectedTech.database.length > 0) {
		instructions += `**Database:** ${data.selectedTech.database.join(', ')}\n`;
	}
	if (data.selectedTech.testing.length > 0) {
		instructions += `**Testing:** ${data.selectedTech.testing.join(', ')}\n`;
	}

	instructions += '\n### Coding Standards\n';
	if (data.guidelines.tabIndentation) instructions += `- Use tab indentation for all code\n`;
	if (data.guidelines.oop) instructions += `- Follow Object-Oriented Programming principles\n`;
	if (data.guidelines.typeHints) instructions += `- Always include type hints where supported\n`;
	if (data.guidelines.semicolons) instructions += `- Use semicolons in JavaScript/TypeScript\n`;
	if (data.guidelines.vanillaJS) instructions += `- Use vanilla JavaScript only (no external frameworks)\n`;
	if (data.guidelines.unitTests) instructions += `- All code must include comprehensive unit tests\n`;
	if (data.guidelines.restfulAPI) instructions += `- Follow RESTful API design principles\n`;
	if (data.guidelines.securityPractices) instructions += `- Implement security best practices\n`;

	if (data.customGuidelines) {
		const customLines = data.customGuidelines.split('\n').filter(line => line.trim());
		customLines.forEach(line => {
			instructions += `- ${line}\n`;
		});
	}

	if (data.projectStructure) {
		instructions += `\n### Project Structure\n${data.projectStructure}\n`;
	}

	if (data.availableResources) {
		instructions += `\n### Available Resources\n${data.availableResources}\n`;
	}

	instructions += `\nAlways follow these guidelines when writing, reviewing, or suggesting code for this project.`;

	return instructions;
}

function generateGenerationPrompt(data) {
	let prompt = `Your task is to "onboard" this repository to a coding agent by adding a .github/copilot-instructions.md file. It should contain information describing how the agent, seeing the repo for the first time, can work most efficiently.\n\n`;

	prompt += `You will do this task only one time per repository, and doing a good job can SIGNIFICANTLY improve the quality of the agent's work, so take your time, think carefully, and search thoroughly before writing the instructions.\n\n`;

	prompt += `## Goals\n\n`;
	prompt += `- Document existing project structure and tech stack.\n`;
	prompt += `- Ensure established practices are followed.\n`;
	prompt += `- Minimize bash command and build failures.\n\n`;

	prompt += `## Project Context\n\n`;
	prompt += `This is a ${data.projectType.toUpperCase()} project called "${data.projectName}".\n`;
	prompt += `${data.projectDescription}\n\n`;

	if (data.selectedTech.backend.length > 0 || data.selectedTech.frontend.length > 0 || data.selectedTech.database.length > 0) {
		prompt += `### Known Technology Stack\n`;
		if (data.selectedTech.backend.length > 0) {
			prompt += `**Backend:** ${data.selectedTech.backend.join(', ')}\n`;
		}
		if (data.selectedTech.frontend.length > 0) {
			prompt += `**Frontend:** ${data.selectedTech.frontend.join(', ')}\n`;
		}
		if (data.selectedTech.database.length > 0) {
			prompt += `**Database:** ${data.selectedTech.database.join(', ')}\n`;
		}
		if (data.selectedTech.testing.length > 0) {
			prompt += `**Testing:** ${data.selectedTech.testing.join(', ')}\n`;
		}
		prompt += '\n';
	}

	const activeGuidelines = Object.entries(data.guidelines)
		.filter(([key, value]) => value)
		.map(([key, value]) => {
			const guidelineMap = {
				typeHints: 'Use type hints where supported',
				semicolons: 'Use semicolons in JavaScript/TypeScript',
				tabIndentation: 'Use tab indentation',
				oop: 'Follow Object-Oriented Programming principles',
				vanillaJS: 'Use vanilla JavaScript (no external frameworks)',
				unitTests: 'Unit tests are required',
				restfulAPI: 'Follow RESTful API design principles',
				securityPractices: 'Follow security best practices'
			};
			return guidelineMap[key];
		});

	if (activeGuidelines.length > 0) {
		prompt += `### Known Coding Guidelines\n`;
		activeGuidelines.forEach(guideline => {
			prompt += `- ${guideline}\n`;
		});
		prompt += '\n';
	}

	prompt += `## Limitations\n`;
	prompt += `- Instructions must be no longer than 2 pages.\n`;
	prompt += `- Instructions should be broadly applicable to the entire project.\n\n`;

	prompt += `## Guidance\n\n`;
	prompt += `Ensure you include the following:\n\n`;
	prompt += `- A summary of what the app does.\n`;
	prompt += `- The tech stack in use\n`;
	prompt += `- Coding guidelines\n`;
	prompt += `- Project structure\n`;
	prompt += `- Existing tools and resources\n\n`;

	prompt += `## Steps to follow\n\n`;
	prompt += `- Perform a comprehensive inventory of the codebase. Search for and view:\n`;
	prompt += `  - README.md, CONTRIBUTING.md, and all other documentation files.\n`;
	prompt += `  - Search the codebase for indications of workarounds like 'HACK', 'TODO', etc.\n`;
	prompt += `- All scripts, particularly those pertaining to build and repo or environment setup.\n`;
	prompt += `- All project files.\n`;
	prompt += `- All configuration and linting files.\n`;
	prompt += `- Document any other steps or information that the agent can use to reduce time spent exploring or trying and failing to run bash commands.\n\n`;

	prompt += `## Validation\n\n`;
	prompt += `Use the newly created instructions file to implement a sample feature. Use the learnings from any failures or errors in building the new feature to further refine the instructions file.`;

	return prompt;
}

function copyToClipboard() {
	const output = document.getElementById('output').textContent;
	navigator.clipboard.writeText(output).then(() => {
		const btn = document.getElementById('copyBtn');
		const originalText = btn.innerHTML;
		btn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
		btn.classList.remove('btn-outline-secondary');
		btn.classList.add('btn-success');

		setTimeout(() => {
			btn.innerHTML = originalText;
			btn.classList.remove('btn-success');
			btn.classList.add('btn-outline-secondary');
		}, 2000);
	});
}

// Event listeners
document.getElementById('projectType').addEventListener('change', populateTechOptions);
document.getElementById('instructionsForm').addEventListener('submit', function (e) {
	e.preventDefault();
	generateInstructions();
});
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
document.querySelectorAll('input[name="outputType"]').forEach(radio => {
	radio.addEventListener('change', function () {
		if (document.getElementById('output').textContent.trim() &&
			!document.getElementById('output').textContent.includes('Fill out the form')) {
			generateInstructions();
		}
	});
});

// Initialize
populateTechOptions();
