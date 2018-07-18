<?php

/**
 * © ICF Church – <web@icf.ch>
 *
 * This source file is subject to the license file that is bundled
 * with this source code in the file LICENSE.
 *
 * File created/changed: 2018-07-18T11:36:17+02:00
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
		$this->add([
			[
				'name' => 'enablemodule',
				'type' => 'checkbox',
				'icon' => 'check',
				'label' => $this->_('Enable Module'),
				'description' => $this->_('Enable this theme. You can untoggle this option to disable the theme without uninstalling this module.'),
				'value' => $this->get('enablemodule'),
			],
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
						'icon' => 'lock',
						'label' => $this->_('Enable For All Users'),
						'description' => $this->_('If enabled, AdminThemeUikit will be set as theme for all users.'),
						'value' => $this->get('allusers'),
					],
					[
						'name' => 'useuikitlogo',
						'type' => 'checkbox',
						'icon' => 'reply',
						'label' => $this->_('Use AdminThemeUikit Logo'),
						'description' => $this->_('Instead of a adark logo, use the one specified in the AdminThemeUikit settings.'),
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
			'useuikitlogo' => false,
		];
	}
}
