<?php

/**
 * © ICF Church – <web@icf.ch>
 *
 * This source file is subject to the license file that is bundled
 * with this source code in the file LICENSE.
 *
 * File created/changed: 2018-07-18T13:50:36+02:00
 */

namespace ProcessWire;

/**
 * AdminThemeBoss Class.
 */
class AdminThemeBoss extends WireData implements Module, ConfigurableModule
{
	/**
	 * Development mode, to be used when developing this module’s code.
	 */
	const dev = false;

	/**
	 * Default logo image file (relative to this dir).
	 */
	const logo = 'uikit/custom/images/pw-mark.png';

	private $adminThemeUikit;

	/*******************************************************************************************
	 * MARKUP RENDERING METHODS
	 *
	 */

	/**
	 * Render a list of breadcrumbs (list items), excluding the containing <ul>.
	 *
	 * @return string
	 */
	public function renderBreadcrumbs(HookEvent $event)
	{
		if (!$event->return) {
			return;
		}

		$process = $this->wire('page')->process;
		if ($process == 'ProcessPageList') {
			return '';
		}
		$breadcrumbs = $this->wire('breadcrumbs');
		$out = '';

		// don't show breadcrumbs if only one of them (subjective)
		if (count($breadcrumbs) < 2 && $process != 'ProcessPageEdit') {
			return '';
		}

		if (strpos($this->layout, 'sidenav') === false) {
			$out = '<li>'.$event->object->renderQuickTreeLink().'</li>';
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
					$edit = "&nbsp;&nbsp;<a href='../edit/?id=$pageid'>$icon</a>";
				}
			} elseif (strpos($breadcrumb->url, '../') !== false && wire('process')) {
				// make sure we're editing a page and not a user
				if (method_exists(wire('process'), 'getPage')) {
					$pageid = wire('process')->getPage()->parent->id;

					if (wire('pages')->get($pageid)->editable()) {
						$edit = "&nbsp;&nbsp;<a href='../edit/?id=$pageid'>$icon</a>";
					}
					// modify open
					$breadcrumb->url = "../?open=$pageid";
				}
			}
			$out .= "<li><a href='$breadcrumb->url'>$title</a>$edit</li>";
		}

		if ($out) {
			$out = "<ul class='uk-breadcrumb'>$out</ul>";
		}

		$event->return = $out;
	}

	/**
	 * Initialize and attach hooks.
	 */
	public function init()
	{
		$this->adminThemeUikit = $this->wire('modules')->get('AdminThemeUikit');

		if ($this->get('allusers') && $this->user->admin_theme !== 'AdminThemeUikit') {
			$this->user->setAndSave('admin_theme', 'AdminThemeUikit');
		}

		if ($this->get('extendedbreadcrumb') && !$this->wire('modules')->isInstalled('BreadcrumbDropdowns')) {
			$this->addHookAfter('AdminThemeUikit::renderBreadcrumbs', $this, 'renderBreadcrumbs');
		}

		$this->addHookAfter('Page::render', $this, 'replaceUikitCSS');
	}

	/**
	 * Get the primary Uikit CSS file to use.
	 *
	 * @return string
	 */
	public function replaceUikitCSS(HookEvent $event)
	{
		$page = $event->object;

		if ($page->template->name !== 'admin') {
			return;
		}

		$moduleInfo = $this->wire('modules')->getModuleInfo($this);

		$themecss = $this->adminThemeUikit->getUikitCSS();

		$config = $this->wire('config');
		$variant = $this->get('variant');

		$version = $moduleInfo['version'];
		$url = $this->wire('config')->urls->AdminThemeBoss;

		switch ($variant) {
			case 'pw':
			case 'black':
			case 'vibrant':
				$variant = $url.'/uikit/dist/css/uikit.'.$variant.'.min.css';
				break;

			default:
				$variant = $url.'/uikit/dist/css/uikit.pw.min.css';
				break;
		}
		// replace CSS and Logo
		$event->return = str_replace($themecss, $variant, $event->return);

		if (!$this->get('useuikitlogo')) {
			$themelogo = $this->adminThemeUikit->getLogoURL();
			$logoURL = $config->urls($this->className()).self::logo;
			$event->return = str_replace($themelogo, $logoURL, $event->return);
		}

		return true;
	}
}
