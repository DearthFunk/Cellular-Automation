(function () {
	'use strict';
	angular
		.module('menuModule', [])
		.directive('menu', menu);

	menu.$inject = [];

	function menu() {
		var directive = {
			restrict: 'A',
			templateUrl: 'app/menu/menu.html',
			replace: true,
			controller: menuController,
			bindToController: true
		};
		return directive;
	}

	menuController.$inject = ['$scope', '$rootScope', 'GROWTH_TYPES', 'menuService'];

	function menuController($scope, $rootScope, GROWTH_TYPES, menuService) {

		$scope.RULE_TEMPLATES = [
			{stayAlive:[2,3], birth:[3], name:"Conway's Life", description:"A chaotic rule that is by far the most well-known and well-studied. It exhibits highly complex behavior."},
			{stayAlive:[1], birth:[1], name:"GnarlA", description:"simple exploding rule that forms complex patterns from even a single live cell."},
			{stayAlive:[1,3,5,7], birth:[1,3,5,7], name:"Replicator", description:"A rule in which every pattern is a replicator."},
			{stayAlive:[0,2,4,6,8], birth:[1,3,5,7], name:"Fredkin", description:"A rule in which, like Replicator, every pattern is a replicator."},
			{stayAlive:[], birth:[2], name:"Seeds", description:"An exploding rule in which every cell dies in every generation. It has many simple orthogonal spaceships, though it is in general difficult to create patterns that don't explode."},
			{stayAlive:[0], birth:[2], name:"Live Free or Die", description:"An exploding rule in which only cells with no neighbors survive. It has many spaceships, puffers, and oscillators, some of infinitely extensible size and period."},
			{stayAlive:[], birth:[2,3,4], name:"Serviettes", description:"An exploding rule in which every cell dies every generation (like seeds). This rule is of interest because of the fabric-like beauty of the patterns that it produces."},
			{stayAlive:[0,2,3], birth:[3], name:"DotLife", description:"An exploding rule closely related to Conway's Life. The B-heptomino is a common infinite growth pattern in this rule, though it can be stabilized into a spaceship."},
			{stayAlive:[0,1,2,3,4,5,6,7,8], birth:[3], name:"Life without", description:"An expanding rule that produces complex flakes. It also has important ladder patterns."},
			{stayAlive:[1,2,3,4], birth:[3], name:"Mazectric", description:"An expanding rule that crystalizes to form maze-like designs that tend to be straighter (ie. have longer halls) than the standard maze rule."},
			{stayAlive:[1,2,3,4,5], birth:[3], name:"Maze", description:"An expanding rule that crystalizes to form maze-like designs."},
			{stayAlive:[4,5,6,78], birth:[3], name:"Coral", description:"An exploding rule in which patterns grow slowly and form coral-like textures."},
			{stayAlive:[3,4], birth:[3,4], name:"34 Life", description:"An exploding rule that was initially thought to be a stable alternative to Conway's Life, until computer simulation found that most patterns tend to explode. It has many small oscillators and simple period 3 orthogonal and diagonal spaceships."},
			{stayAlive:[4,5,6,7], birth:[3,4,5], name:"Assimilation", description:"A very stable rule that forms permanent diamond-shaped patterns with partially filled interiors."},
			{stayAlive:[5], birth:[3,4,5], name:"Long Life", description:"A stable rule that gets its name from the fact that it has many simple extremely high period oscillators."},
			{stayAlive:[5,6,7,8], birth:[3,5,6,7,8], name:"Diamoeba", description:"A chaotic pattern that forms large diamonds with chaotically oscillating boundaries. Known to have quadratically-growing patterns."},
			{stayAlive:[1,3,5,8], birth:[3,5,7], name:"Amoeba", description:"A chaotic rule that is well balanced between life and death; it forms patterns with chaotic interiors and wildly moving boundaries."},
			{stayAlive:[2,3,8], birth:[3,5,7], name:"Pseudo Life", description:"A chaotic rule with evolution that resembles Conway's Life, but few patterns from Life work in this rule because the glider is unstable."},
			{stayAlive:[1,2,5], birth:[3,6], name:"2x2", description:"A chaotic rule with many simple still lifes, oscillators and spaceships. Its name comes from the fact that it sends patterns made up of 2x2 blocks to patterns made up of 2x2 blocks."},
			{stayAlive:[2,3], birth:[3,6], name:"HighLife", description:"A chaotic rule very similar to Conway's Life that is of interest because it has a simple replicator."},
			{stayAlive:[2,4,5], birth:[3,6,8], name:"Move", description:"A rule in which random patterns tend to stabilize extremely quickly. Has a very common slow-moving spaceship and slow-moving puffer."},
			{stayAlive:[2,3,5,6,7,8], birth:[3,6,7,8], name:"Stains", description:"A stable rule in which most patterns tend to 'fill in' bounded regions. Most nearby rules (such as coagulations) tend to explode."},
			{stayAlive:[3,4,6,7,8], birth:[3,6,7,8], name:"Day & Night", description:"A stable rule that is symmetric under on-off reversal. Many patterns exhibiting highly complex behavior have been found for it."},
			{stayAlive:[2,3], birth:[3,7], name:"DryLife", description:"An exploding rule closely related to Conway's Life, named after the fact that the standard spaceships bigger than the glider do not function in the rule. Has a small puffer based on the R-pentomino, which resembles the switch engine in the possibility of combining several to form a spaceship."},
			{stayAlive:[2,3,5,6,7,8], birth:[3,7,8], name:"Coagulations", description:"An exploding rule in which patterns tend to expand forever, producing a thick 'goo' as it does so."},
			{stayAlive:[2,3,4,5], birth:[4,5,6,7,8], name:"Walled cities", description:"A stable rule that forms centers of pseudo-random activity separated by walls."},
			{stayAlive:[3,5,6,7,8], birth:[4,6,7,8], name:"Vote 4/5", description:"A modification of the standard Gérard Vichniac voting rule, also known as 'Anneal', used as a model for majority voting."},
			{stayAlive:[4,5,6,7,8], birth:[5,6,7,8], name:"Vote", description:"Standard Gérard Vichniac voting rule, also known as 'Majority', used as a model for majority voting."}
		];

		$scope.menuService = menuService;
		$scope.GROWTH_TYPES = GROWTH_TYPES;

		$scope.clearGrid = clearGrid;
		$scope.loadRule = loadRule;
		$scope.recalculateColors = recalculateColors;
		$scope.drawStep = drawStep;

		$scope.editingSpeed = false;
		$scope.menuSize = 220;

		//set initial activeGrowthType
		menuService.activeGrowthType = angular.copy(menuService.growthTypes[1]);
		menuService.activeGrowthType.stayAlive =angular.copy( $scope.RULE_TEMPLATES[0].stayAlive);
		menuService.activeGrowthType.birth = angular.copy($scope.RULE_TEMPLATES[0].birth);

		///////////////////////////////////////////////////

		function loadRule(rule) {
			menuService.activeGrowthType.stayAlive = angular.copy(rule.stayAlive);
			menuService.activeGrowthType.birth = angular.copy(rule.birth);
		}
		function drawStep(e) {
			e.stopPropagation();
			$rootScope.$broadcast('drawStepEvent');
		}
		function clearGrid(e)    {
			e.stopPropagation();
			$rootScope.$broadcast('clearGridEvent');
		}
		function recalculateColors() {
			$rootScope.$broadcast('calculateColorsEvent');
		}
	}
})();