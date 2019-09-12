<?php

/**
 * © ICF Church – <web@icf.ch>.
 *
 * This source file is subject to the license file that is bundled
 * with this source code in the file LICENSE.
 *
 * File created/changed: 2018-12-18T13:00:03+01:00
 */

namespace ProcessWire;

/**
 * AdminThemeBoss Class.
 */
class AdminThemeBoss extends WireData implements Module, ConfigurableModule
{
	/**
	 * Default logo image file (relative to this dir).
	 */
	const logo = 'uikit/custom/images/pw-mark.png';

	public function ___upgrade()
	{
		$this->cache->deleteFor($this);
	}

	public function ___uninstall()
	{
		$this->cache->deleteFor($this);
	}

	/*
	 * MARKUP RENDERING METHODS
	 *
	 */

	/**
	 * Initialize and attach hooks.
	 */
	public function init()
	{
		$this->addHookBefore('Modules::saveConfig', $this, 'updateSettings');

		if (!$this->get('enablemodule')) {
			return;
		}

		if ($this->get('allusers') && 'AdminThemeUikit' !== $this->user->admin_theme) {
			$this->user->setAndSave('admin_theme', 'AdminThemeUikit');
		}

		if ($this->get('extendedbreadcrumb') && !$this->wire('modules')->isInstalled('BreadcrumbDropdowns')) {
			$this->addHookAfter('AdminThemeUikit::renderBreadcrumbs', $this, 'renderBreadcrumbs');
		}

		// add placeholder text
		$this->wire()->addHookAfter('ProcessLogin::buildLoginForm', function (HookEvent $event) {
			$event->return->get('login_name')->set('placeholder', $event->return->get('login_name')->get('label'));
			$event->return->get('login_pass')->set('placeholder', $event->return->get('login_pass')->get('label'));
		});
	}

	public function ready()
	{
		if (!$this->get('enablemodule')) {
			return;
		}

		// remove uikit css…
		if ($this->modules->getConfig('AdminThemeUikit', 'cssURL')) {
			$this->config->styles->remove($this->modules->getConfig('AdminThemeUikit', 'cssURL'));
		}

		// add this css…
		$this->config->styles->append($this->getVariant());
	}

	protected function updateSettings(HookEvent $event)
	{
		$class = $event->arguments(0);

		// update logo…
		if ($class == $this->className()) {
			$this->cache->deleteFor($this, 'cssurl');

			$newSettings = $event->arguments(1);
			$oldSettings = $this->modules->getConfig($this);

			// save old settings…
			if ($oldSettings['enablemodule'] && false == $newSettings['enablemodule']) {
				$this->message('Module disabled. Settings cached…');
				$this->cache->saveFor($this, 'oldSettings', $oldSettings);
			}
			// reapply old settings…
			elseif ($newSettings['enablemodule'] && false == $oldSettings['enablemodule']) {
				// use old settings as new ones…
				$newSettings = $this->cache->getFor($this, 'oldSettings');
				if ($newSettings) {
					$event->arguments(1, $newSettings);
					$this->cache->deleteFor($this, 'oldSettings');
					$this->message('Module settings restored…');
				}
			}

			$logo      = $this->urls->AdminThemeBoss . self::logo;
			$uikitlogo = $this->modules->getConfig('AdminThemeUikit', 'logoURL');

			$usedark   = $newSettings['usedarklogo'];

			if (!is_file($this->config->paths->root . $uikitlogo) || $usedark && is_file($this->config->paths->root . $logo)) {
				if (is_file($this->config->paths->root . $uikitlogo) && $logo !== $uikitlogo) {
					$this->warning('AdminThemeUikit uses a custom logo – this setting has no effect');
				} else {
					$this->modules->saveConfig('AdminThemeUikit', 'logoURL', $logo);
				}
			}

			if (!$usedark && $logo == $uikitlogo) {
				$this->modules->saveConfig('AdminThemeUikit', 'logoURL', '');
			}
		}
	}

	/**
	 * Render a list of breadcrumbs (list items), excluding the containing <ul>.
	 *
	 * @return string
	 */
	protected function renderBreadcrumbs(HookEvent $event)
	{
		if (!$event->return) {
			return;
		}

		$process = $this->wire('page')->process;
		if ('ProcessPageList' == $process) {
			return '';
		}
		$breadcrumbs = $this->wire('breadcrumbs');
		$out         = '';

		// don't show breadcrumbs if only one of them (subjective)
		if (count($breadcrumbs) < 2 && 'ProcessPageEdit' != $process) {
			return '';
		}

		if (false === strpos($this->layout, 'sidenav')) {
			$out = '<li>' . $event->object->renderQuickTreeLink() . '</li>';
		}

		foreach ($breadcrumbs as $breadcrumb) {
			$title = $breadcrumb->get('titleMarkup');
			if (!$title) {
				$title = $this->wire('sanitizer')->entities1($this->_($breadcrumb->title));
			}

			$edit = '';
			$icon = $event->object->renderIcon('pencil');
			if (strpos($breadcrumb->url, 'open=') > 0) {
				$pageid = explode('open=', $breadcrumb->url);
				$pageid = end($pageid);
				if (wire('pages')->get($pageid)->editable()) {
					$edit = "&nbsp;&nbsp;<a href='../edit/?id={$pageid}'>{$icon}</a>";
				}
			} elseif (false !== strpos($breadcrumb->url, '../') && wire('process')) {
				// make sure we're editing a page and not a user
				if (method_exists(wire('process'), 'getPage')) {
					$pageid = wire('process')->getPage()->parent->id;

					if (wire('pages')->get($pageid)->editable()) {
						$edit = "&nbsp;&nbsp;<a href='../edit/?id={$pageid}'>{$icon}</a>";
					}
					// modify open
					$breadcrumb->url = "../?open={$pageid}";
				}
			}
			$out .= "<li><a href='{$breadcrumb->url}'>{$title}</a>{$edit}</li>";
		}

		if ($out) {
			$out = "<ul class='uk-breadcrumb'>{$out}</ul>";
		}

		$event->return = $out;
	}

	private function getVariant()
	{
		$expires = $this->config->debug ? time() - 10 : WireCache::expireNever;
		$url     = $this->cache->getFor($this, 'cssurl', $expires, function () {
			$variant = $this->get('variant');
			$version = $this->config->debug ? time() : $this->modules->getModuleInfoProperty($this, 'version');
			$url     = $this->config->urls->AdminThemeBoss;

			// default
			$file = $url . 'uikit/dist/css/uikit.blue.min.css?' . $version;

			$exists = is_file($this->config->paths->AdminThemeBoss . 'uikit/dist/css/uikit.' . $variant . '.min.css');
			if ($exists) {
				//bd($this->modules->getModuleInfoProperty($this, 'version'));
				$file = $url . 'uikit/dist/css/uikit.' . $variant . '.min.css?' . $version;
			}

			return $file;
		});

		return $url;
	}
}
