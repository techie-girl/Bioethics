// A drop-down menu with miscellaneous editing options for a story.

const { escape } = require('underscore');
const Vue = require('vue');
const FormatDialog = require('../../../dialogs/story-format');
const JavaScriptEditor = require('../../../editors/javascript');
const StatsDialog = require('../../../dialogs/story-stats');
const StylesheetEditor = require('../../../editors/stylesheet');
const locale = require('../../../locale');
const { prompt } = require('../../../dialogs/prompt');
const { publishStoryWithFormat } = require('../../../data/publish');
const save = require('../../../file/save');
const { loadFormat, updateStory } = require('../../../data/actions');

module.exports = Vue.extend({
	template: require('./index.html'),

	props: {
		story: {
			type: Object,
			required: true
		}
	},

	methods: {
		editScript() {
			// We have to manually inject the Vuex store, since the editors are
			// mounted outside the app scope.

			new JavaScriptEditor({
				data: { storyId: this.story.id },
				store: this.$store
			}).$mountTo(document.body);
		},

		editStyle() {
			new StylesheetEditor({
				data: { storyId: this.story.id },
				store: this.$store
			}).$mountTo(document.body);
		},

		renameStory() {
			prompt({
				message:
					locale.say(
						'What should &ldquo;%s&rdquo; be renamed to?',
						escape(this.story.name)
					),
				buttonLabel:
					'<i class="fa fa-ok"></i> ' + locale.say('Rename'),
				response:
					this.story.name,
				blankTextError:
					locale.say('Please enter a name.')
			})
			.then(text => this.updateStory(this.story.id, { name: text }));
		},

		proofStory() {
			window.open(
				'#!/stories/' + this.story.id + '/proof',
				'twinestory_proof_' + this.story.id
			);
		},

		/**
		 Saves the story to the server
		
		 @method publish
		**/
		
		publish() {
			const formatName = this.story.format || this.defaultFormatName;
			const format = this.allFormats.find(
				format => format.name === formatName
			);

			this.loadFormat(formatName).then(() => {
				save(
					publishStoryWithFormat(this.appInfo, this.story, format),
					this.story.name + '.html',
					false
				);
			});
		},
		
		/**
		 Saves the story to this computer.
		
		 @method download
		**/
		
		download(){
			
			const formatName = this.story.format || this.defaultFormatName;
			const format = this.allFormats.find(
				format => format.name === formatName
			);

			this.loadFormat(formatName).then(() => {
				save(
					publishStoryWithFormat(this.appInfo, this.story, format),
					this.story.name + '.html', 
					true
				);
			});
			
		},

		storyStats() {
			new StatsDialog({
				data: { storyId: this.story.id },
				store: this.$store
			}).$mountTo(document.body);
		},

		changeFormat() {
			new FormatDialog({
				data: { storyId: this.story.id },
				store: this.$store
			}).$mountTo(document.body);
		},

		toggleSnap() {
			this.updateStory(
				this.story.id,
				{ snapToGrid: !this.story.snapToGrid }
			);
		}
	},

	components: {
		'drop-down': require('../../../ui/drop-down')
	},

	vuex: {
		actions: {
			loadFormat,
			updateStory
		},

		getters: {
			allFormats: state => state.storyFormat.formats,
			appInfo: state => state.appInfo,
			defaultFormatName: state => state.pref.defaultFormat
		}
	}
});
