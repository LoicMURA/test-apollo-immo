<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AppController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function index(): Response
    {
        return $this->redirectToRoute('voiture_index');
    }

    /**
     * @Route("/test", name="test")
     */
    public function test(): Response
    {
        return $this->render('base.html.twig');
    }
}
