<?php

/**
 * © ICF Church – <web@icf.ch>
 *
 * This source file is subject to the license file that is bundled
 * with this source code in the file LICENSE.
 *
 * File created/changed: 2018-10-09T15:35:44+02:00
 */

namespace ProcessWire;

if (!defined('PROCESSWIRE')) {
	die();
}

/**
 * Implementation for Uikit admin theme getConfigInputfields method.
 *
 * @param AdminTheme|AdminThemeBoss $adminTheme
 * @param InputfieldWrapper         $inputfields
 */
class AdminThemeBossConfig extends ModuleConfig
{
	public function __construct()
	{
		$adminThemeUrl = $this->modules->getModuleEditUrl('AdminThemeUikit');

		$this->add([
			[
				'type' => 'fieldset',
				'name' => 'theme-options',
				'label' => $this->_('Theme Options'),
				'icon' => 'paint-brush',
				//'showIf' => 'enablemodule=1',
				'children' => [
					[
						'name' => 'variant',
						'type' => 'radios',
						'icon' => 'adjust',
						'label' => $this->_('Color'),
						//'description' => $this->_('If "No" is selected, then upgrades will only be checked manually when you click to Setup > Upgrades.'),
						//'notes' => $this->_('Automatic upgrade check requires ProcessWire 2.5.20 or newer.'),
						//'optionColumns' => 1,
						'value' => $this->get('variant'),
						'options' => [
							'pw' => $this->_('ProcessWire Blue'),
							'vibrant' => $this->_('Vibrant Blue'),
							'black' => $this->_('Dark Black'),
						],
					],
					[
						'name' => 'extendedbreadcrumb',
						'type' => 'checkbox',
						'icon' => 'link',
						'label' => $this->_('Extended Breadcrumb'),
						'checkboxLabel' => $this->_('Yes, use extended breadcrumb'),
						'description' => $this->_('If set, the default breadcrumb will be extended with edit links'),
						'notes' => $this->_('Only applies if Module BreadcrumbDropdowns is not installed.'),
						'value' => $this->get('extendedbreadcrumb'),
					],
				],
			],
			[
				'type' => 'fieldset',
				'name' => 'advanced-options',
				'label' => $this->_('Advanced Options'),
				'icon' => 'cog',
				'collapsed' => Inputfield::collapsedYes,
				//'showIf' => 'enablemodule=1',
				'children' => [
					[
						'name' => 'allusers',
						'type' => 'checkbox',
						'icon' => 'user',
						'label' => $this->_('Enable For All Users'),
						'checkboxLabel' => $this->_('Yes'),
						'description' => $this->_('If enabled, [AdminThemeUikit]('.$adminThemeUrl.') will be set as theme for all users.'),
						'value' => $this->get('allusers'),
					],
					[
						'name' => 'uselogo',
						'type' => 'checkbox',
						'icon' => 'bookmark',
						'label' => $this->_('Use Dark ProcessWire Logo'),
						'checkboxLabel' => $this->_('Yes'),
						'description' => $this->_('Set a dark theme logo for the [AdminThemeUikit]('.$adminThemeUrl.') logo settings.'),
						'value' => $this->get('useuikitlogo'),
					],
				],
			],
		]);
	}

	public function getDefaults()
	{
		return [
			'enablemodule' => true,
			'variant' => 'pw',
			'extendedbreadcrumb' => true,
			'allusers' => true,
			'uselogo' => true,
		];
	}
}
